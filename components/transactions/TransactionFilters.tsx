"use client"

import { X } from "lucide-react"

import { categories } from "@/data/categories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/store/useAppStore"

interface TransactionFiltersProps {
  onExportCsv?: () => void
  canExport?: boolean
}

const HIGH_EXPENSE_MIN = 120

export function TransactionFilters({ onExportCsv, canExport = false }: TransactionFiltersProps) {
  const filters = useAppStore((state) => state.filters)
  const setFilter = useAppStore((state) => state.setFilter)
  const setFilters = useAppStore((state) => state.setFilters)
  const clearFilters = useAppStore((state) => state.clearFilters)

  const typeLabel =
    filters.type === "all"
      ? "All Types"
      : filters.type === "income"
        ? "Income"
        : "Expense"

  const statusLabel =
    filters.status === "all"
      ? "All Status"
      : filters.status === "completed"
        ? "Completed"
        : "Pending"

  const categoryLabel =
    filters.category === "all" ? "All Categories" : filters.category

  const sortLabel =
    filters.sortBy === "date" && filters.sortDirection === "desc"
      ? "Newest"
      : filters.sortBy === "date" && filters.sortDirection === "asc"
        ? "Oldest"
        : filters.sortBy === "amount" && filters.sortDirection === "desc"
          ? "Highest Amount"
          : "Lowest Amount"

  const applyQuickView = (view: "thisMonth" | "pending" | "highExpense") => {
    const todayMonth = new Date().toISOString().slice(0, 7)

    if (view === "thisMonth") {
      setFilters({
        dateRange: {
          from: `${todayMonth}-01`,
          to: `${todayMonth}-31`,
        },
        status: "all",
        amountRange: { min: null, max: null },
      })
      return
    }

    if (view === "pending") {
      setFilters({
        status: "pending",
        dateRange: { from: null, to: null },
        amountRange: { min: null, max: null },
      })
      return
    }

    setFilters({
      type: "expense",
      status: "all",
      dateRange: { from: null, to: null },
      amountRange: { min: HIGH_EXPENSE_MIN, max: null },
    })
  }

  const applySortPreset = (preset: "newest" | "oldest" | "highest" | "lowest") => {
    if (preset === "newest") {
      setFilters({ sortBy: "date", sortDirection: "desc" })
      return
    }

    if (preset === "oldest") {
      setFilters({ sortBy: "date", sortDirection: "asc" })
      return
    }

    if (preset === "highest") {
      setFilters({ sortBy: "amount", sortDirection: "desc" })
      return
    }

    setFilters({ sortBy: "amount", sortDirection: "asc" })
  }

  return (
    <div className="space-y-3 rounded-4xl border border-border/70 bg-card/75 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => applyQuickView("thisMonth")}>
          This Month
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => applyQuickView("pending")}>
          Pending
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => applyQuickView("highExpense")}>
          High Expense
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_1fr_1fr_0.9fr_auto_auto] lg:items-center">
      <Input
        id="tx-search-input"
        name="search"
        autoComplete="off"
        aria-label="Search transactions by description"
        value={filters.search}
        onChange={(event) => setFilter("search", event.target.value)}
        placeholder="Search by description..."
        className="bg-background"
      />

      <Select
        value={filters.type}
        onValueChange={(value) => setFilter("type", value as "all" | "income" | "expense")}
      >
        <SelectTrigger id="tx-type-filter" className="w-full bg-background" aria-label="Filter by type">
          <SelectValue placeholder="Type">{typeLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) =>
          setFilter("status", value as "all" | "completed" | "pending")
        }
      >
        <SelectTrigger className="w-full bg-background" aria-label="Filter by status">
          <SelectValue placeholder="Status">{statusLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(value) => setFilter("category", value ?? "all")}
      >
        <SelectTrigger className="w-full bg-background" aria-label="Filter by category">
          <SelectValue placeholder="Category">{categoryLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={
          filters.sortBy === "date" && filters.sortDirection === "desc"
            ? "newest"
            : filters.sortBy === "date" && filters.sortDirection === "asc"
              ? "oldest"
              : filters.sortBy === "amount" && filters.sortDirection === "desc"
                ? "highest"
                : "lowest"
        }
        onValueChange={(value) =>
          applySortPreset(value as "newest" | "oldest" | "highest" | "lowest")
        }
      >
        <SelectTrigger className="w-full bg-background" aria-label="Quick sort preset">
          <SelectValue placeholder="Sort">{sortLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="highest">Highest Amount</SelectItem>
          <SelectItem value="lowest">Lowest Amount</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        name="fromDate"
        autoComplete="off"
        aria-label="Filter from date"
        value={filters.dateRange.from ?? ""}
        onChange={(event) =>
          setFilter("dateRange", { ...filters.dateRange, from: event.target.value || null })
        }
        className="bg-background"
      />

      <Input
        type="date"
        name="toDate"
        autoComplete="off"
        aria-label="Filter to date"
        value={filters.dateRange.to ?? ""}
        onChange={(event) =>
          setFilter("dateRange", { ...filters.dateRange, to: event.target.value || null })
        }
        className="bg-background"
      />

      <Button variant="outline" onClick={clearFilters} className="w-full lg:w-auto">
        <X className="size-4" /> Clear
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onExportCsv}
        disabled={!canExport}
        className="w-full lg:w-auto"
      >
        Export CSV
      </Button>
      </div>
    </div>
  )
}
