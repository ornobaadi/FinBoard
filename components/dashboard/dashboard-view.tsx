"use client"

import * as React from "react"

import {
  getCategoryBreakdown,
  getExpenseMonthOverMonth,
  getIncomeExpenseRatio,
  getMonthlyTotals,
  getMonthlyTrend,
  getTopSpendingCategory,
} from "@/lib/insights"
import { safePercentChange, toMonthKey } from "@/lib/utils"
import { useAppStore } from "@/store/use-app-store"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { InsightsPanel } from "@/components/dashboard/insights-panel"
import { MonthlyTrendChart } from "@/components/dashboard/monthly-trend-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SummaryCard } from "@/components/dashboard/summary-card"

export function DashboardView() {
  const transactions = useAppStore((state) => state.transactions)

  const latestMonthKey = React.useMemo(() => {
    if (!transactions.length) {
      return toMonthKey(new Date().toISOString().slice(0, 10))
    }

    const latestDate = [...transactions]
      .map((tx) => tx.date)
      .sort((a, b) => b.localeCompare(a))[0]

    return toMonthKey(latestDate)
  }, [transactions])

  const previousMonthKey = React.useMemo(() => {
    const [year, month] = latestMonthKey.split("-").map(Number)
    const previous = new Date(year, month - 2, 1)
    const keyMonth = String(previous.getMonth() + 1).padStart(2, "0")
    return `${previous.getFullYear()}-${keyMonth}`
  }, [latestMonthKey])

  const currentKey = latestMonthKey
  const previousKey = previousMonthKey
  const current = getMonthlyTotals(transactions, currentKey)
  const previous = getMonthlyTotals(transactions, previousKey)

  const topCategory = getTopSpendingCategory(transactions)
  const monthComparison = getExpenseMonthOverMonth(transactions, currentKey, previousKey)
  const ratio = getIncomeExpenseRatio(transactions, currentKey)
  const categoryBreakdown = getCategoryBreakdown(transactions, currentKey)
  const monthlyTrend = getMonthlyTrend(transactions)
  const pendingTotal = transactions
    .filter((tx) => tx.status === "pending")
    .reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 fx-rise">
        <SummaryCard
          title="Total Income"
          value={current.income}
          change={safePercentChange(current.income, previous.income)}
        />
        <SummaryCard
          title="Total Expenses"
          value={current.expense}
          change={safePercentChange(current.expense, previous.expense)}
        />
        <SummaryCard
          title="Net Balance"
          value={current.net}
          change={safePercentChange(current.net, previous.net)}
        />
        <SummaryCard
          title="Total Transactions"
          value={current.count}
          change={safePercentChange(current.count, previous.count)}
          type="number"
        />
      </section>

      <div className="fx-rise fx-rise-delay-1">
        <InsightsPanel
          topCategory={topCategory}
          monthComparison={monthComparison}
          ratio={ratio}
          pendingTotal={pendingTotal}
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_1fr] fx-rise fx-rise-delay-2">
        <MonthlyTrendChart data={monthlyTrend} />
        <CategoryChart data={categoryBreakdown} />
      </section>

      <div className="fx-rise fx-rise-delay-3">
        <RecentTransactions
          transactions={[...transactions].sort((a, b) => b.date.localeCompare(a.date))}
        />
      </div>
    </div>
  )
}
