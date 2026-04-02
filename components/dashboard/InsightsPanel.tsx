import { ArrowDownUp, GaugeCircle, PieChart } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface InsightsPanelProps {
  monthLabel: string
  topCategory: { name: string; amount: number }
  budgetHealth: { status: "safe" | "watch" | "risk"; label: string; reason: string }
  expenseChangePercent: number
}

export function InsightsPanel({
  monthLabel,
  topCategory,
  budgetHealth,
  expenseChangePercent,
}: InsightsPanelProps) {
  const budgetTone =
    budgetHealth.status === "safe"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : budgetHealth.status === "watch"
        ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "bg-rose-500/10 text-rose-700 dark:text-rose-300"

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-2.5">
        <CardTitle className="text-lg">Insights</CardTitle>
        <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {monthLabel}
        </span>
      </CardHeader>
      <CardContent className="grid gap-2.5 pt-1 pb-4 md:grid-cols-3">
        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <PieChart className="size-3.5" /> Top Category
          </p>
          <p className="mt-2 text-base font-semibold leading-tight">{topCategory.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(topCategory.amount)}</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <ArrowDownUp className="size-3.5" /> Expense Trend
          </p>
          <p className="mt-2 text-base font-semibold tabular-nums">{formatPercent(expenseChangePercent)}</p>
          <p className="mt-1 text-sm text-muted-foreground">Compared to previous month</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <GaugeCircle className="size-3.5" /> Budget Health
          </p>
          <p className="mt-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${budgetTone}`}>
              {budgetHealth.label}
            </span>
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{budgetHealth.reason}</p>
        </div>
      </CardContent>
    </Card>
  )
}
