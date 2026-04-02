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

export type BudgetHealthStatus = "safe" | "watch" | "risk"

export interface InsightSummary {
  currentMonthLabel: string
  topCategory: { name: string; amount: number }
  topCategories: Array<{ name: string; amount: number; sharePercent: number }>
  expenseChangePercent: number
  incomeExpenseRatio: number
  burnRate: {
    spent: number
    elapsedDays: number
    totalDays: number
    projectedExpense: number
  }
  budgetHealth: {
    status: BudgetHealthStatus
    label: string
    reason: string
  }
  anomaly: {
    id: string
    description: string
    category: string
    amount: number
    date: string
    month: string
    monthLabel: string
  } | null
  narratives: {
    trend: string
    category: string
  }
  monthlyTrend: MonthlyStat[]
  categoryBreakdown: Array<{ category: string; amount: number }>
}
