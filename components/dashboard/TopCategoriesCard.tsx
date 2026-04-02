import { Medal, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryChartColor } from "@/lib/category-colors"
import { formatCurrency } from "@/lib/utils"

interface TopCategoriesCardProps {
  monthLabel: string
  data: Array<{ name: string; amount: number; sharePercent: number }>
}

export function TopCategoriesCard({ monthLabel, data }: TopCategoriesCardProps) {
  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="inline-flex items-center gap-2 text-lg">
          <TrendingUp className="size-4" /> Top 3 Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-1 pb-4">
        <p className="text-xs tracking-[0.08em] text-muted-foreground uppercase">
          {monthLabel} concentration snapshot
        </p>

        {data.length ? (
          data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-3xl border border-border/70 bg-background/70 px-3 py-2.5"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: getCategoryChartColor(item.name, index) }}
                  aria-hidden
                />
                <Medal className="size-3.5 text-muted-foreground" />
                {item.name}
              </span>
              <span className="text-right">
                <span className="block text-sm font-semibold tabular-nums">
                  {formatCurrency(item.amount)}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {item.sharePercent.toFixed(1)}%
                </span>
              </span>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-dashed border-border/70 px-3 py-4 text-sm text-muted-foreground">
            No category data yet for this month.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
