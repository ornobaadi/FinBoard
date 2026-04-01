"use client"

import { FilterX } from "lucide-react"

import { categories } from "@/data/categories"
import { useAppStore } from "@/store/use-app-store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TransactionFilters() {
  const filters = useAppStore((state) => state.filters)
  const setFilter = useAppStore((state) => state.setFilter)
  const clearFilters = useAppStore((state) => state.clearFilters)

  const toggleCategory = (category: string) => {
    const selected = filters.category.includes(category)

    if (selected) {
      setFilter(
        "category",
        filters.category.filter((item) => item !== category)
      )
      return
    }

    setFilter("category", [...filters.category, category])
  }

  return (
    <div className="grid gap-3 rounded-3xl border border-border/70 bg-card/80 p-4 shadow-sm lg:grid-cols-7">
      <Input
        value={filters.search}
        onChange={(event) => setFilter("search", event.target.value)}
        placeholder="Search description"
        className="lg:col-span-2"
      />

      <Select
        value={filters.type}
        onValueChange={(value) => setFilter("type", value as "all" | "income" | "expense")}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Type" />
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
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" className="w-full" />}>
          {filters.category.length ? `${filters.category.length} categories` : "Categories"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Select categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {categories.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              checked={filters.category.includes(category)}
              onCheckedChange={() => toggleCategory(category)}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Input
        value={filters.dateRange.from ?? ""}
        onChange={(event) =>
          setFilter("dateRange", {
            ...filters.dateRange,
            from: event.target.value || null,
          })
        }
        type="date"
      />

      <Input
        value={filters.dateRange.to ?? ""}
        onChange={(event) =>
          setFilter("dateRange", {
            ...filters.dateRange,
            to: event.target.value || null,
          })
        }
        type="date"
      />

      <Button
        variant="secondary"
        className="lg:col-span-7 lg:justify-self-end"
        onClick={() => clearFilters()}
      >
        <FilterX className="size-4" />
        Clear Filters
      </Button>
    </div>
  )
}
