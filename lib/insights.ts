import type {
  MonthlySeriesPoint,
  SpendingCategoryPoint,
  Transaction,
} from "@/types"
import { safePercentChange, toMonthKey } from "@/lib/utils"

function sumAmountByType(transactions: Transaction[], type: "income" | "expense") {
  return transactions
    .filter((tx) => tx.type === type)
    .reduce((sum, tx) => sum + tx.amount, 0)
}

export function getCurrentAndPreviousMonthKeys(now = new Date()) {
  const current = new Date(now.getFullYear(), now.getMonth(), 1)
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const format = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0")
    return `${date.getFullYear()}-${month}`
  }

  return {
    currentKey: format(current),
    previousKey: format(previous),
  }
}

export function getMonthlyTotals(transactions: Transaction[], monthKey: string) {
  const monthItems = transactions.filter((tx) => toMonthKey(tx.date) === monthKey)
  const income = sumAmountByType(monthItems, "income")
  const expense = sumAmountByType(monthItems, "expense")

  return {
    income,
    expense,
    net: income - expense,
    count: monthItems.length,
  }
}

export function getTopSpendingCategory(transactions: Transaction[]) {
  const expenseTotals = new Map<string, number>()

  for (const tx of transactions) {
    if (tx.type !== "expense") {
      continue
    }
    expenseTotals.set(tx.category, (expenseTotals.get(tx.category) ?? 0) + tx.amount)
  }

  let topCategory = "-"
  let topAmount = 0

  for (const [category, amount] of expenseTotals.entries()) {
    if (amount > topAmount) {
      topCategory = category
      topAmount = amount
    }
  }

  return {
    category: topCategory,
    amount: topAmount,
  }
}

export function getExpenseMonthOverMonth(transactions: Transaction[], currentKey: string, previousKey: string) {
  const currentExpense = getMonthlyTotals(transactions, currentKey).expense
  const previousExpense = getMonthlyTotals(transactions, previousKey).expense

  return {
    currentExpense,
    previousExpense,
    percentageChange: safePercentChange(currentExpense, previousExpense),
  }
}

export function getIncomeExpenseRatio(transactions: Transaction[], monthKey: string) {
  const { income, expense } = getMonthlyTotals(transactions, monthKey)
  const ratio = expense === 0 ? income : income / expense

  return {
    income,
    expense,
    ratio,
  }
}

export function getCategoryBreakdown(transactions: Transaction[], monthKey: string): SpendingCategoryPoint[] {
  const totals = new Map<string, number>()

  for (const tx of transactions) {
    if (tx.type === "expense" && toMonthKey(tx.date) === monthKey) {
      totals.set(tx.category, (totals.get(tx.category) ?? 0) + tx.amount)
    }
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export function getMonthlyTrend(transactions: Transaction[]): MonthlySeriesPoint[] {
  const byMonth = new Map<string, { income: number; expense: number }>()

  for (const tx of transactions) {
    const month = toMonthKey(tx.date)
    const existing = byMonth.get(month) ?? { income: 0, expense: 0 }

    if (tx.type === "income") {
      existing.income += tx.amount
    } else {
      existing.expense += tx.amount
    }

    byMonth.set(month, existing)
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({ month, ...values }))
}
