"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { initialTransactions } from "@/data/transactions"
import type { Filters, Role, Transaction } from "@/types"

const defaultFilters: Filters = {
  search: "",
  type: "all",
  status: "all",
  category: [],
  dateRange: {
    from: null,
    to: null,
  },
}

interface AppState {
  transactions: Transaction[]
  role: Role
  filters: Filters
  setRole: (role: Role) => void
  setFilter: <K extends keyof Filters>(key: K, value: Filters[K]) => void
  clearFilters: () => void
  addTransaction: (tx: Omit<Transaction, "id">) => void
  updateTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
}

function createTransactionId() {
  const random = Math.random().toString(36).slice(2, 7)
  return `txn_${Date.now()}_${random}`
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
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
      clearFilters: () => set({ filters: defaultFilters }),
      addTransaction: (tx) =>
        set((state) => ({
          transactions: [{ id: createTransactionId(), ...tx }, ...state.transactions],
        })),
      updateTransaction: (id, updates) =>
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updates } : tx
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((tx) => tx.id !== id),
        })),
    }),
    {
      name: "finboard-store-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        role: state.role,
        filters: state.filters,
      }),
    }
  )
)
