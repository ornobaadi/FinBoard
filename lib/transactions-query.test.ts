/* global describe, it, expect */

import { filterAndSortTransactions } from "@/lib/transactions-query"
import { transactions } from "@/data/transactions"
import { Filters } from "@/types"

const baseFilters: Filters = {
  search: "",
  type: "all",
  status: "all",
  category: "all",
  dateRange: { from: null, to: null },
  amountRange: { min: null, max: null },
  sortBy: "date",
  sortDirection: "desc",
}

describe("filterAndSortTransactions", () => {
  it("filters by pending status", () => {
    const result = filterAndSortTransactions(transactions, {
      ...baseFilters,
      status: "pending",
    })

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((tx) => tx.status === "pending")).toBe(true)
  })

  it("applies amount sort ascending", () => {
    const result = filterAndSortTransactions(transactions, {
      ...baseFilters,
      sortBy: "amount",
      sortDirection: "asc",
    })

    expect(result[0].amount).toBeLessThanOrEqual(result[result.length - 1].amount)
  })

  it("applies text search and type filter together", () => {
    const result = filterAndSortTransactions(transactions, {
      ...baseFilters,
      search: "salary",
      type: "income",
    })

    expect(result.length).toBeGreaterThan(0)
    expect(result.every((tx) => tx.type === "income")).toBe(true)
    expect(
      result.every((tx) => tx.description.toLowerCase().includes("salary"))
    ).toBe(true)
  })
})
