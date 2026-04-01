export type Role = "viewer" | "admin"

export type TransactionType = "income" | "expense"

export type TransactionStatus = "completed" | "pending"

export interface Transaction {
  id: string
  description: string
  amount: number
  type: TransactionType
  category: string
  date: string
  status: TransactionStatus
}

export interface Filters {
  search: string
  type: "all" | TransactionType
  status: "all" | TransactionStatus
  category: string[]
  dateRange: {
    from: string | null
    to: string | null
  }
}

export interface MonthlySeriesPoint {
  month: string
  income: number
  expense: number
}

export interface SpendingCategoryPoint {
  category: string
  amount: number
}
