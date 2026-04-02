import { ArrowDownUp, PieChart, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface InsightsPanelProps {
  topCategory: { name: string; amount: number }
  expenseChangePercent: number
  incomeExpenseRatio: number
}

export function InsightsPanel({
  topCategory,
  expenseChangePercent,
  incomeExpenseRatio,
}: InsightsPanelProps) {
  const ratioLabel = Number.isFinite(incomeExpenseRatio)
    ? `${incomeExpenseRatio.toFixed(2)} : 1`
    : "0 : 1"

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2.5">
        <CardTitle className="text-lg">Insights</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2.5 pt-1 pb-4 sm:grid-cols-3">
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
      </CardContent>
    </Card>
  )
}
