import { InsightSummary, MonthlyStat, Transaction } from "@/types"

const monthLabel = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
})

export function getMonthKey(date: string) {
  return date.slice(0, 7)
}

export function getCurrentMonthKey(transactions: Transaction[]) {
  if (!transactions.length) {
    return new Date().toISOString().slice(0, 7)
  }

  return [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))[0]
    .date.slice(0, 7)
}

export function getPreviousMonthKey(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number)
  const date = new Date(year, month - 2, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function toMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number)
  return monthLabel.format(new Date(year, month - 1, 1))
}

export function getMonthlyTotals(
  items: Transaction[],
  monthKey: string
): { income: number; expense: number; count: number } {
  return items.reduce(
    (acc, item) => {
      if (getMonthKey(item.date) !== monthKey) {
        return acc
      }

      if (item.type === "income") {
        acc.income += item.amount
      } else {
        acc.expense += item.amount
      }

      acc.count += 1
      return acc
    },
    { income: 0, expense: 0, count: 0 }
  )
}

export function getSummaryInsights(transactions: Transaction[]): InsightSummary {
  const currentMonth = getCurrentMonthKey(transactions)
  const previousMonth = getPreviousMonthKey(currentMonth)

  const currentExpenseByCategory = new Map<string, number>()
  let currentIncome = 0
  let currentExpense = 0
  let previousExpense = 0

  for (const tx of transactions) {
    const txMonth = getMonthKey(tx.date)

    if (txMonth === currentMonth && tx.type === "income") {
      currentIncome += tx.amount
    }

    if (txMonth === currentMonth && tx.type === "expense") {
      currentExpense += tx.amount
      currentExpenseByCategory.set(
        tx.category,
        (currentExpenseByCategory.get(tx.category) ?? 0) + tx.amount
      )
    }

    if (txMonth === previousMonth && tx.type === "expense") {
      previousExpense += tx.amount
    }
  }

  const categoryBreakdown = [...currentExpenseByCategory.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)

  const topCategory = categoryBreakdown[0] ?? { category: "No expenses", amount: 0 }

  const expenseChangePercent = previousExpense
    ? ((currentExpense - previousExpense) / previousExpense) * 100
    : currentExpense
      ? 100
      : 0

  const monthlyMap = new Map<string, MonthlyStat>()

  for (const tx of transactions) {
    const key = getMonthKey(tx.date)
    const row = monthlyMap.get(key) ?? {
      month: toMonthLabel(key),
      income: 0,
      expense: 0,
    }

    if (tx.type === "income") {
      row.income += tx.amount
    } else {
      row.expense += tx.amount
    }

    monthlyMap.set(key, row)
  }

  const monthlyTrend = [...monthlyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((entry) => entry[1])

  return {
    topCategory: { name: topCategory.category, amount: topCategory.amount },
    expenseChangePercent,
    incomeExpenseRatio: currentExpense ? currentIncome / currentExpense : 0,
    monthlyTrend,
    categoryBreakdown,
  }
}
