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

function getMonthMeta(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number)
  const totalDays = new Date(year, month, 0).getDate()
  const today = new Date()
  const isCurrentRealMonth =
    today.getFullYear() === year && today.getMonth() + 1 === month
  const elapsedDays = isCurrentRealMonth ? Math.max(1, today.getDate()) : totalDays

  return {
    totalDays,
    elapsedDays,
  }
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
  const currentMonthLabel = toMonthLabel(currentMonth)

  const currentExpenseByCategory = new Map<string, number>()
  const expenseTransactions: Transaction[] = []
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
      expenseTransactions.push(tx)
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
  const topCategories = categoryBreakdown.slice(0, 3).map((item) => ({
    name: item.category,
    amount: item.amount,
    sharePercent: currentExpense ? (item.amount / currentExpense) * 100 : 0,
  }))

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

  const { elapsedDays, totalDays } = getMonthMeta(currentMonth)
  const projectedExpense = elapsedDays ? (currentExpense / elapsedDays) * totalDays : currentExpense

  const savingsRate = currentIncome
    ? ((currentIncome - currentExpense) / currentIncome) * 100
    : 0

  const budgetHealth =
    savingsRate >= 20
      ? {
          status: "safe" as const,
          label: "Safe",
          reason: "Savings pace is strong this month.",
        }
      : savingsRate >= 5
        ? {
            status: "watch" as const,
            label: "Watch",
            reason: "Spending is rising faster than savings.",
          }
        : {
            status: "risk" as const,
            label: "Risk",
            reason: "Current run-rate may pressure month-end balance.",
          }

  const averageExpense = expenseTransactions.length
    ? expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0) / expenseTransactions.length
    : 0
  const variance = expenseTransactions.length
    ? expenseTransactions.reduce((sum, tx) => {
        const delta = tx.amount - averageExpense
        return sum + delta * delta
      }, 0) / expenseTransactions.length
    : 0
  const stdDev = Math.sqrt(variance)
  const anomalyThreshold = averageExpense + stdDev * 1.8
  const anomalyCandidate = expenseTransactions
    .filter((tx) => tx.amount >= anomalyThreshold && tx.amount > 0)
    .sort((a, b) => b.amount - a.amount)[0]

  const anomaly = anomalyCandidate
    ? {
        id: anomalyCandidate.id,
        description: anomalyCandidate.description,
        category: anomalyCandidate.category,
        amount: anomalyCandidate.amount,
        date: anomalyCandidate.date,
        month: getMonthKey(anomalyCandidate.date),
        monthLabel: toMonthLabel(getMonthKey(anomalyCandidate.date)),
      }
    : null

  const topThreeShare = topCategories.reduce((sum, item) => sum + item.sharePercent, 0)
  const narratives = {
    trend:
      expenseChangePercent > 0
        ? `Expenses are up ${expenseChangePercent.toFixed(1)}% vs last month; projected spend is ${Math.round(projectedExpense).toLocaleString()} BDT.`
        : `Expenses are down ${Math.abs(expenseChangePercent).toFixed(1)}% vs last month; current run-rate projects ${Math.round(projectedExpense).toLocaleString()} BDT.`,
    category:
      topCategories.length > 0
        ? `${topCategories[0].name} leads this month at ${topCategories[0].sharePercent.toFixed(1)}% of expenses. Top 3 categories contribute ${topThreeShare.toFixed(1)}% overall.`
        : "No category concentration yet. Add expenses to reveal dominant spending buckets.",
  }

  return {
    currentMonthLabel,
    topCategory: { name: topCategory.category, amount: topCategory.amount },
    topCategories,
    expenseChangePercent,
    incomeExpenseRatio: currentExpense ? currentIncome / currentExpense : 0,
    burnRate: {
      spent: currentExpense,
      elapsedDays,
      totalDays,
      projectedExpense,
    },
    budgetHealth,
    anomaly,
    narratives,
    monthlyTrend,
    categoryBreakdown,
  }
}
