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

export interface DateRange {
  from: string | null
  to: string | null
}

export interface Filters {
  search: string
  type: "all" | TransactionType
  category: string
  dateRange: DateRange
}

export interface MonthlyStat {
  month: string
  income: number
  expense: number
}

export interface InsightSummary {
  topCategory: { name: string; amount: number }
  expenseChangePercent: number
  incomeExpenseRatio: number
  monthlyTrend: MonthlyStat[]
  categoryBreakdown: Array<{ category: string; amount: number }>
}
