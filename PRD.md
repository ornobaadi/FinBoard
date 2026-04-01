# PRD — Finance Dashboard
**Project Type:** Frontend Technical Assessment  
**Stack:** Next.js 16 · TypeScript · Tailwind CSS · shadcn/ui  
**Author:** Aadi  
**Version:** 1.0  

---

## 1. Overview

A role-based personal finance dashboard that lets users view, filter, and manage financial transactions. The app demonstrates clean UI design, responsive layout, meaningful data insights, and proper RBAC (Role-Based Access Control) — all powered by mock data with no backend required.

---

## 2. Goals

- Build a fully functional, visually polished finance dashboard in Next.js 16 using the App Router
- Implement two user roles — **Viewer** and **Admin** — with distinct capabilities
- Surface meaningful insights derived from transaction data
- Demonstrate clean state management and component architecture
- Handle edge cases gracefully (empty states, no data, loading)

---

## 3. Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| State Management | Zustand |
| Charts | Recharts |
| Data Persistence | localStorage (optional enhancement) |
| Mock Data | `/data/transactions.ts` (static JSON) |
| Icons | lucide-react |

---

## 4. User Roles

### 4.1 Viewer
- Can view the dashboard summary cards
- Can view the transactions table
- Can apply filters (date, category, type)
- Can view the insights section
- **Cannot** add, edit, or delete transactions

### 4.2 Admin
- All Viewer capabilities
- **Can** add new transactions via a modal form
- **Can** edit any existing transaction inline or via modal
- **Can** delete transactions

### 4.3 Role Switching
A visible **role toggle** (dropdown or toggle switch) in the header allows switching between Viewer and Admin for demonstration purposes. Role state persists across the session via Zustand.

---

## 5. Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Summary cards + recent transactions preview + insights |
| `/transactions` | Transactions | Full transaction table with filters and CRUD (admin only) |

Both pages share the same layout with a sidebar/navbar and the role toggle.

---

## 6. Features

### 6.1 Dashboard Page (`/`)

**Summary Cards**
- Total Income (current month)
- Total Expenses (current month)
- Net Balance (income − expenses)
- Total Transactions count

Each card shows the current month value and a comparison badge vs. the previous month (e.g. `+12% vs last month`).

**Recent Transactions**
- Shows the 5 most recent transactions
- Includes a "View All" link to `/transactions`

**Insights Section**
- Highest spending category (with amount)
- Month-over-month expense comparison (March vs February)
- Income vs Expense ratio for current month
- A bar or pie chart showing spending breakdown by category

---

### 6.2 Transactions Page (`/transactions`)

**Filters Bar**
- Search by description (text input)
- Filter by Type: All / Income / Expense
- Filter by Category (multi-select or dropdown)
- Filter by Date Range (month picker or date range inputs)
- Clear Filters button

**Transactions Table**

| Column | Description |
|---|---|
| Date | Formatted as DD MMM YYYY |
| Description | Transaction name |
| Category | Category badge with color |
| Type | Income (green) / Expense (red) pill |
| Amount | Formatted in BDT (৳) |
| Status | Completed / Pending badge |
| Actions | Edit / Delete (Admin only) |

- Sorted by date descending by default
- Pagination or infinite scroll (at least 10 rows per page)
- Empty state component when no results match filters

**Add Transaction (Admin only)**
- Floating "Add Transaction" button (bottom-right or top-right)
- Opens a modal with a form:
  - Description (text)
  - Amount (number)
  - Type (Income / Expense — radio or select)
  - Category (select from predefined list)
  - Date (date picker)
  - Status (Completed / Pending)
- Form validation (all fields required, amount must be positive)
- On submit: adds to Zustand store and closes modal

**Edit Transaction (Admin only)**
- Edit button on each table row opens the same modal pre-filled
- On submit: updates the transaction in the store

**Delete Transaction (Admin only)**
- Delete button triggers a confirmation dialog (shadcn AlertDialog)
- On confirm: removes from store

---

### 6.3 Insights Section

Displayed on the Dashboard page. Computed from the current transaction data in the store.

| Insight | Description |
|---|---|
| Top Spending Category | Category with the highest total expense amount |
| Month Comparison | % change in total expenses vs previous month |
| Income vs Expense | Ratio or split for the current month |
| Category Breakdown Chart | Bar chart or Donut chart of expenses by category |
| Monthly Trend Chart | Line or bar chart comparing income/expense over available months |

All insights update reactively when transactions are added, edited, or deleted.

---

## 7. State Management (Zustand)

### Store Shape

```ts
interface AppState {
  // Data
  transactions: Transaction[]

  // Role
  role: 'viewer' | 'admin'
  setRole: (role: 'viewer' | 'admin') => void

  // Filters
  filters: {
    search: string
    type: 'all' | 'income' | 'expense'
    category: string[]
    dateRange: { from: string | null; to: string | null }
  }
  setFilter: (key: string, value: unknown) => void
  clearFilters: () => void

  // CRUD (admin only)
  addTransaction: (tx: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}
```

The store initializes with data from `/data/transactions.ts`. If localStorage persistence is implemented, hydrate from storage on load and sync on every change.

---

## 8. Data Model

```ts
interface Transaction {
  id: string              // e.g. "txn_001"
  description: string
  amount: number          // in BDT (Bangladeshi Taka)
  type: 'income' | 'expense'
  category: string        // e.g. "Food & Groceries"
  date: string            // ISO format: "YYYY-MM-DD"
  status: 'completed' | 'pending'
}
```

**Predefined Categories:**
- Salary
- Freelance
- Investment
- Food & Groceries
- Transport
- Utilities
- Health
- Education
- Entertainment
- Shopping
- Housing

---

## 9. Project Structure

```
/app
  layout.tsx                  ← Root layout with sidebar + role toggle
  page.tsx                    ← Dashboard page
  /transactions
    page.tsx                  ← Transactions page

/components
  /layout
    Sidebar.tsx
    Header.tsx
    RoleToggle.tsx
  /dashboard
    SummaryCard.tsx
    RecentTransactions.tsx
    InsightsPanel.tsx
    CategoryChart.tsx
    MonthlyTrendChart.tsx
  /transactions
    TransactionTable.tsx
    TransactionFilters.tsx
    TransactionModal.tsx        ← Add / Edit form
    DeleteConfirmDialog.tsx
  /ui                           ← shadcn components (auto-generated)
  EmptyState.tsx
  StatusBadge.tsx
  CategoryBadge.tsx

/store
  useAppStore.ts                ← Zustand store

/data
  transactions.ts               ← Mock transaction data
  categories.ts                 ← Predefined category list

/lib
  utils.ts                      ← cn(), formatCurrency(), formatDate()
  insights.ts                   ← Pure functions for computing insights

/types
  index.ts                      ← Transaction, Role, Filter interfaces
```

---

## 10. UI/UX Specifications

### Layout
- Left sidebar (desktop) with nav links: Dashboard, Transactions
- Top header with app title and role toggle
- Collapsible sidebar or bottom nav on mobile

### Responsive Breakpoints
- Mobile (< 640px): Stacked layout, hidden sidebar, bottom navigation
- Tablet (640px–1024px): Compact sidebar or hamburger menu
- Desktop (> 1024px): Full sidebar visible

### Empty States
- No transactions at all → Illustration + "No transactions yet" message
- No results after filtering → "No results match your filters" + Clear Filters button
- All components handle `undefined` or empty array gracefully

---

## 11. Optional Enhancements (Bonus)

| Feature | Notes |
|---|---|
| Dark Mode | Toggle in header; use Tailwind `dark:` classes throughout |
| localStorage Persistence | Hydrate Zustand store from localStorage on mount |
| Export CSV/JSON | Button in Transactions page; use filtered data |
| Animations | Framer Motion for modal entrance, card hover, row add/remove |
| Advanced Filtering | Sort by column headers; filter by status (pending/completed) |

---

## 12. Build Order (Recommended)

1. **Scaffold** — `npx create-next-app@latest`, install dependencies (shadcn, zustand, recharts, lucide-react)
2. **Types & Data** — `/types/index.ts`, `/data/transactions.ts`, `/data/categories.ts`
3. **Store** — Zustand store with mock data + all actions
4. **Layout** — Sidebar, Header, RoleToggle
5. **Dashboard Page** — SummaryCards → RecentTransactions → InsightsPanel
6. **Charts** — CategoryChart + MonthlyTrendChart using Recharts
7. **Transactions Page** — Table → Filters → Empty state
8. **CRUD Modals** — TransactionModal (add/edit) + DeleteConfirmDialog (admin only)
9. **Responsiveness** — Mobile layout, collapsed sidebar
10. **Polish** — Dark mode, animations, empty states, loading skeletons
11. **README** — Setup instructions, feature overview, assumptions

---

## 13. README Requirements

The submitted README must include:

- Project overview (1–2 sentences)
- Setup instructions (`npm install`, `npm run dev`)
- Feature list
- Approach and architecture decisions
- State management explanation
- Assumptions made
- Optional enhancements implemented
- Screenshots (optional but recommended)

---

## 14. Evaluation Checklist

| Criteria | Implementation Target |
|---|---|
| Design & Creativity | shadcn/ui + custom Tailwind theming, chart visualizations |
| Responsiveness | Mobile-first layout with sidebar collapse |
| Functionality | Full RBAC, filtering, CRUD for admin |
| User Experience | Clear empty states, confirmation dialogs, reactive insights |
| Technical Quality | Typed interfaces, modular components, Zustand store |
| State Management | Zustand with computed selectors for insights |
| Documentation | Complete README with setup + approach |
| Attention to Detail | Edge cases, loading states, form validation |
