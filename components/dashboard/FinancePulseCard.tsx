import { Clock3, GaugeCircle, Target, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface FinancePulseCardProps {
  netBalance: number
  expenseChangePercent: number
  savingsRate: number
  pendingCount: number
}

export function FinancePulseCard({
  netBalance,
  expenseChangePercent,
  savingsRate,
  pendingCount,
}: FinancePulseCardProps) {
  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg">Finance Pulse</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2.5 pt-1 pb-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <GaugeCircle className="size-3.5" /> Net Balance
          </p>
          <p className="mt-1.5 font-semibold tabular-nums">{formatCurrency(netBalance)}</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <TrendingUp className="size-3.5" /> Expense Trend
          </p>
          <p className="mt-1.5 font-semibold tabular-nums">{formatPercent(expenseChangePercent)}</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <Target className="size-3.5" /> Savings Rate
          </p>
          <p className="mt-1.5 font-semibold tabular-nums">{Math.max(0, savingsRate).toFixed(1)}%</p>
        </div>

        <div className="rounded-3xl border border-border/70 bg-background/70 p-3.5">
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.12em] text-muted-foreground uppercase">
            <Clock3 className="size-3.5" /> Pending
          </p>
          <p className="mt-1.5 font-semibold tabular-nums">{pendingCount} transactions</p>
        </div>
      </CardContent>
    </Card>
  )
}
