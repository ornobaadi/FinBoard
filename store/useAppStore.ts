"use client"

import { useMemo } from "react"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { getScenarioTransactions, getSeedTransactions } from "@/data/scenarios"
import { getCurrentMonthKey, getMonthlyTotals, getSummaryInsights } from "@/lib/insights"
import { filterAndSortTransactions } from "@/lib/transactions-query"
import { DemoScenarioKey, Filters, Role, Transaction } from "@/types"

interface AppState {
  transactions: Transaction[]
  scenario: DemoScenarioKey
  role: Role
  filters: Filters
  setRole: (role: Role) => void
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  setFilters: (updates: Partial<Filters>) => void
  clearFilters: () => void
  loadScenario: (scenario: DemoScenarioKey) => void
  resetDemoData: () => void
  addTransaction: (tx: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

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

function createTransactionId(items: Transaction[]) {
  return `txn_${String(items.length + 1).padStart(3, "0")}_${Date.now()}`
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: getSeedTransactions(),
      scenario: "balanced",
      role: "viewer",
      filters: defaultFilters,
      setRole: (role) => set({ role }),
      setFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),
      setFilters: (updates) =>
        set((state) => ({
          filters: {
            ...state.filters,
            ...updates,
          },
        })),
      clearFilters: () => set({ filters: defaultFilters }),
      loadScenario: (scenario) =>
        set({
          transactions: getScenarioTransactions(scenario),
          scenario,
          filters: defaultFilters,
        }),
      resetDemoData: () =>
        set({
          transactions: getSeedTransactions(),
          scenario: "balanced",
          filters: defaultFilters,
        }),
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { id: createTransactionId(state.transactions), ...tx },
            ...state.transactions,
          ],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((item) => item.id !== id),
        })),
    }),
    {
      name: "finboard-app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        scenario: state.scenario,
        role: state.role,
      }),
    }
  )
)

export function useFilteredTransactions() {
  const transactions = useAppStore((state) => state.transactions)
  const filters = useAppStore((state) => state.filters)

  return useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters]
  )
}

export function useDashboardStats() {
  const transactions = useAppStore((state) => state.transactions)

  return useMemo(() => {
    const currentMonth = getCurrentMonthKey(transactions)
    const previousMonth = new Date(`${currentMonth}-01`)
    previousMonth.setMonth(previousMonth.getMonth() - 1)
    const previousMonthKey = `${previousMonth.getFullYear()}-${String(previousMonth.getMonth() + 1).padStart(2, "0")}`

    const current = getMonthlyTotals(transactions, currentMonth)
    const previous = getMonthlyTotals(transactions, previousMonthKey)
    const insights = getSummaryInsights(transactions)

    return {
      currentMonth,
      totals: {
        income: current.income,
        expense: current.expense,
        net: current.income - current.expense,
        transactions: current.count,
      },
      comparison: {
        income: previous.income ? ((current.income - previous.income) / previous.income) * 100 : 0,
        expense: previous.expense ? ((current.expense - previous.expense) / previous.expense) * 100 : 0,
        net: previous.income - previous.expense
          ? ((current.income - current.expense - (previous.income - previous.expense)) /
              (previous.income - previous.expense)) *
            100
          : 0,
        transactions: previous.count
          ? ((current.count - previous.count) / previous.count) * 100
          : 0,
      },
      insights,
      recentTransactions: [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 5),
    }
  }, [transactions])
}
