import { ArrowRightLeft, Landmark, TrendingDown, Wallet } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface InsightsPanelProps {
  topCategory: { category: string; amount: number }
  monthComparison: { currentExpense: number; previousExpense: number; percentageChange: number }
  ratio: { income: number; expense: number; ratio: number }
  pendingTotal: number
}

export function InsightsPanel({
  topCategory,
  monthComparison,
  ratio,
  pendingTotal,
}: InsightsPanelProps) {
  const cards = [
    {
      title: "Top Spending Category",
      value: topCategory.category,
      helper: formatCurrency(topCategory.amount),
      icon: Landmark,
    },
    {
      title: "Expense Month Comparison",
      value: formatPercent(monthComparison.percentageChange),
      helper: `${formatCurrency(monthComparison.currentExpense)} this month`,
      icon: TrendingDown,
    },
    {
      title: "Income vs Expense Ratio",
      value: `${ratio.ratio.toFixed(2)} : 1`,
      helper: `${formatCurrency(ratio.income)} vs ${formatCurrency(ratio.expense)}`,
      icon: ArrowRightLeft,
    },
    {
      title: "Pending Transaction Value",
      value: formatCurrency(pendingTotal),
      helper: "Outstanding total amount",
      icon: Wallet,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.title} className="border-border/70 bg-card/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 inline-flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-4" />
              </div>
              <p className="text-xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.helper}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
