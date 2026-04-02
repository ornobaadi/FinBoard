import { ArrowDownUp, PieChart, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface InsightsPanelProps {
  monthLabel: string
  topCategory: { name: string; amount: number }
  burnRate: { spent: number; elapsedDays: number; totalDays: number; projectedExpense: number }
  budgetHealth: { status: "safe" | "watch" | "risk"; label: string; reason: string }
  expenseChangePercent: number
  incomeExpenseRatio: number
}

export function InsightsPanel({
  monthLabel,
  topCategory,
  burnRate,
  budgetHealth,
  expenseChangePercent,
  incomeExpenseRatio,
}: InsightsPanelProps) {
  const ratioLabel = Number.isFinite(incomeExpenseRatio)
    ? `${incomeExpenseRatio.toFixed(2)} : 1`
    : "0 : 1"

  const budgetTone =
    budgetHealth.status === "safe"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : budgetHealth.status === "watch"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-rose-500/10 text-rose-700 dark:text-rose-300"

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2.5">
        <CardTitle className="text-lg">Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2.5 pt-1 pb-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <PieChart className="size-3.5" /> Top Spending Category
          </p>
          <p className="mt-2 font-semibold">{topCategory.name}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(topCategory.amount)}</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <ArrowDownUp className="size-3.5" /> Expense vs Previous Month
          </p>
          <p className="mt-2 font-semibold tabular-nums">{formatPercent(expenseChangePercent)}</p>
          <p className="text-sm text-muted-foreground">Month-over-month change</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <TrendingUp className="size-3.5" /> Income to Expense
          </p>
          <p className="mt-2 font-semibold tabular-nums">{ratioLabel}</p>
          <p className="text-sm text-muted-foreground">Current month ratio</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">Burn Rate</p>
          <p className="mt-2 font-semibold tabular-nums">
            {Math.round(burnRate.projectedExpense).toLocaleString()} BDT
          </p>
          <p className="text-sm text-muted-foreground">
            Projected by day {burnRate.elapsedDays}/{burnRate.totalDays}
          </p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">Budget Health</p>
          <p className="mt-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${budgetTone}`}>
              {budgetHealth.label}
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{budgetHealth.reason}</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5 sm:col-span-2 xl:col-span-1">
          <p className="text-xs tracking-[0.12em] text-muted-foreground uppercase">Month Context</p>
          <p className="mt-2 font-semibold">{monthLabel}</p>
          <p className="text-sm text-muted-foreground">Data story for current reporting month</p>
        </div>
      </CardContent>
    </Card>
  )
}
