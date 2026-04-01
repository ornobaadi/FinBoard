import { ArrowDownRight, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"

interface SummaryCardProps {
  title: string
  value: number
  change: number
  type?: "currency" | "number"
}

export function SummaryCard({
  title,
  value,
  change,
  type = "currency",
}: SummaryCardProps) {
  const isUp = change >= 0

  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">
          {type === "currency" ? formatCurrency(value) : value.toLocaleString("en-BD")}
        </p>
        <div className="mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs">
          {isUp ? (
            <ArrowUpRight className="size-3 text-emerald-500" />
          ) : (
            <ArrowDownRight className="size-3 text-rose-500" />
          )}
          <span className={isUp ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}>
            {formatPercent(change)}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
