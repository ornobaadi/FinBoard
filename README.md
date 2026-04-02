# Finboard

Finboard is a role-based personal finance dashboard built with Next.js App Router, Zustand, Tailwind CSS, shadcn/ui, and Recharts. It provides a modern dashboard experience for tracking transactions, spending patterns, and month-over-month performance.

## Links

- Live Demo: https://finboard-tracker.vercel.app/
- Repository: https://github.com/ornobaadi/FinBoard

## Features

- Dashboard with summary cards:
	- Total Income
	- Total Expenses
	- Net Balance
	- Transaction Count
- Insights and analytics cards:
	- Top spending category
	- Expense change vs previous month
	- Income-to-expense ratio
	- Spending category breakdown chart
	- Monthly trend chart
	- Finance pulse card (net, trend, savings rate, pending count)
- Transactions workspace (`/transactions`):
	- Search by description
	- Filter by type
	- Filter by category
	- Date range filter
	- Paginated transaction table
- Role-based behavior:
	- Viewer: read-only dashboard and transactions
	- Admin: add, edit, and delete transactions
- UI/UX:
	- Responsive layout with sidebar and mobile bottom navigation
	- Light/dark mode toggle
	- Persistent role and transaction state (Zustand persist)

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Base UI primitives)
- Zustand
- Recharts
- Lucide icons

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks

## Project Structure

- `app/` - Routes and app-level metadata
- `components/` - UI and feature components
- `store/` - Zustand store and selectors
- `data/` - Mock categories and transactions
- `lib/` - Utilities and insights calculations
- `types/` - Shared TypeScript types

## State Management

Zustand is used for:

- Role state (`viewer` / `admin`)
- Transactions list and CRUD operations
- Filter state for transactions page
- Derived dashboard metrics and insights

State is persisted in localStorage for transactions and role continuity between reloads.

## SEO

The app includes App Router metadata with:

- Global title template and description
- Open Graph and Twitter metadata
- `robots.txt` route
- `sitemap.xml` route

Configured production base URL:

- https://finboard-tracker.vercel.app/

## Assumptions

- Data is mock/static with client-side persistence only.
- Authentication is not implemented; role toggle is included for demonstration.
- Currency display uses BDT formatting.
