# Finboard - Finance Dashboard UI

Finboard is a role-based personal finance dashboard built for a frontend assessment. It focuses on clear information hierarchy, reactive insights, and clean interaction design without backend dependencies.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state management + localStorage persistence)
- Recharts (data visualization)
- lucide-react (icons)

## Features

- Dashboard summary cards: income, expenses, net, transaction count
- Month-over-month comparison badges
- Insights panel: top category, expense change, ratio, pending amount
- Time-based chart: monthly income/expense trend
- Categorical chart: expense category breakdown
- Transactions page with:
	- search
	- type filter
	- category multi-filter
	- date range filter
	- clear filters
	- paginated table (10 rows/page)
- Role switcher in header:
	- Viewer: read-only mode
	- Admin: add/edit/delete actions
- CRUD transaction workflows with modal form and delete confirmation dialog
- Responsive shell:
	- Desktop sidebar
	- Mobile bottom navigation
- Empty states for no data and no filter results
- Theme toggle (light/dark)
- Store persistence with localStorage

## Routes

- `/` - Dashboard overview, insights, recent transactions
- `/transactions` - Full transaction management experience

## Project Structure

```text
app/
	layout.tsx
	page.tsx
	transactions/page.tsx
components/
	dashboard/
	layout/
	transactions/
	ui/
data/
	categories.ts
	transactions.ts
lib/
	insights.ts
	utils.ts
store/
	use-app-store.ts
types/
	index.ts
```

## State Management Approach

The app uses a single Zustand store (`store/use-app-store.ts`) with:

- `transactions` as the source of truth
- `role` for role simulation
- `filters` for the transactions page
- CRUD actions: `addTransaction`, `updateTransaction`, `deleteTransaction`
- `persist` middleware for localStorage hydration

Derived insight values (monthly totals, category aggregates, ratios, trend points) are computed via pure helper functions in `lib/insights.ts`.

## Architecture Decisions

- Centralized state with selectors keeps UI components simple and reactive.
- Shared shell in root layout guarantees consistent navigation/role controls across routes.
- Pure computation layer (`lib/insights.ts`) avoids UI-state coupling and keeps analytics testable.
- Component boundaries follow feature slices (`dashboard`, `transactions`, `layout`).

## Assumptions

- Data is frontend-only; no backend/API required.
- Roles are simulated for demonstration and not security boundaries.
- Date filtering uses transaction ISO date strings.
- Transaction list is expected to be small enough for client-side filtering and pagination.

## Optional Enhancements Implemented

- Dark mode toggle
- localStorage persistence (transactions, role, filters)

## Validation

The project has been validated with:

```bash
npm run typecheck
npm run lint
```
