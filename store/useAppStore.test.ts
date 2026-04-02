/* global describe, it, expect, beforeEach */

import { getSeedTransactions } from "@/data/scenarios"
import { useAppStore } from "@/store/useAppStore"
import { Filters } from "@/types"

const defaultFilters: Filters = {
  search: "",
  type: "all",
  status: "all",
  category: "all",
  dateRange: { from: null, to: null },
  amountRange: { min: null, max: null },
  sortBy: "date",
  sortDirection: "desc",
}

describe("useAppStore actions", () => {
  beforeEach(() => {
    localStorage.clear()
    useAppStore.setState({
      transactions: getSeedTransactions(),
      scenario: "balanced",
      role: "viewer",
      filters: defaultFilters,
    })
  })

  it("adds, updates, and deletes a transaction", () => {
    const before = useAppStore.getState().transactions.length

    useAppStore.getState().addTransaction({
      description: "Test transaction",
      amount: 500,
      type: "expense",
      category: "Utilities",
      date: "2026-04-12",
      status: "completed",
    })

    const added = useAppStore.getState().transactions
    expect(added.length).toBe(before + 1)

    const id = added[0].id
    useAppStore.getState().updateTransaction(id, { amount: 800 })
    expect(useAppStore.getState().transactions[0].amount).toBe(800)

    useAppStore.getState().deleteTransaction(id)
    expect(useAppStore.getState().transactions.length).toBe(before)
  })

  it("loads scenario and resets demo data", () => {
    useAppStore.getState().loadScenario("overspending")

    expect(useAppStore.getState().scenario).toBe("overspending")

    useAppStore.getState().resetDemoData()

    expect(useAppStore.getState().scenario).toBe("balanced")
    expect(useAppStore.getState().transactions.length).toBe(getSeedTransactions().length)
  })
})
