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

export function TransactionFilters() {
  const filters = useAppStore((state) => state.filters)
  const setFilter = useAppStore((state) => state.setFilter)
  const clearFilters = useAppStore((state) => state.clearFilters)

  return (
    <div className="grid gap-3 rounded-4xl border border-border/70 bg-card/75 p-4 lg:grid-cols-[1.6fr_0.8fr_0.8fr_1fr_1fr_auto] lg:items-center">
      <Input
        value={filters.search}
        onChange={(event) => setFilter("search", event.target.value)}
        placeholder="Search by description"
        className="bg-background"
      />

      <Select
        value={filters.type}
        onValueChange={(value) => setFilter("type", value as "all" | "income" | "expense")}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All types</SelectItem>
          <SelectItem value="income">Income</SelectItem>
          <SelectItem value="expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(value) => setFilter("category", value ?? "all")}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.dateRange.from ?? ""}
        onChange={(event) =>
          setFilter("dateRange", { ...filters.dateRange, from: event.target.value || null })
        }
        className="bg-background"
      />

      <Input
        type="date"
        value={filters.dateRange.to ?? ""}
        onChange={(event) =>
          setFilter("dateRange", { ...filters.dateRange, to: event.target.value || null })
        }
        className="bg-background"
      />

      <Button variant="outline" onClick={clearFilters} className="w-full lg:w-auto">
        <X className="size-4" /> Clear
      </Button>
    </div>
  )
}
