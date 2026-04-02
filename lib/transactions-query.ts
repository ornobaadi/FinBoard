import { Filters, Transaction } from "@/types"

export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: Filters
) {
  return transactions
    .filter((tx) => {
      if (
        filters.search &&
        !tx.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      if (filters.type !== "all" && tx.type !== filters.type) {
        return false
      }

      if (filters.status !== "all" && tx.status !== filters.status) {
        return false
      }

      if (filters.category !== "all" && tx.category !== filters.category) {
        return false
      }

      if (filters.dateRange.from && tx.date < filters.dateRange.from) {
        return false
      }

      if (filters.dateRange.to && tx.date > filters.dateRange.to) {
        return false
      }

      if (filters.amountRange.min !== null && tx.amount < filters.amountRange.min) {
        return false
      }

      if (filters.amountRange.max !== null && tx.amount > filters.amountRange.max) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      const direction = filters.sortDirection === "asc" ? 1 : -1

      if (filters.sortBy === "amount") {
        return (a.amount - b.amount) * direction
      }

      if (filters.sortBy === "status") {
        return a.status.localeCompare(b.status) * direction
      }

      return a.date.localeCompare(b.date) * direction
    })
}
