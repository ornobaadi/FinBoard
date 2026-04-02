import { ArrowDownLeft, ArrowUpRight, LucideIcon } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  title: string
  value: number
  isCurrency?: boolean
  changePercent: number
  icon: LucideIcon
}

export function SummaryCard({
  title,
  value,
  isCurrency = true,
  changePercent,
  icon: Icon,
}: SummaryCardProps) {
  const positive = changePercent >= 0

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="pt-4 pb-2.5">
        <CardDescription className="flex items-center justify-between text-xs tracking-[0.12em] uppercase">
          {title}
          <span className="rounded-full bg-emerald-500/10 p-2 text-emerald-700 dark:text-emerald-300">
            <Icon className="size-4" />
          </span>
        </CardDescription>
        <CardTitle className="text-[2rem] leading-tight font-semibold tabular-nums">
          {isCurrency ? formatCurrency(value) : value.toLocaleString()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            positive
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 text-rose-700 dark:text-rose-300"
          )}
        >
          {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownLeft className="size-3" />}
          {formatPercent(changePercent)} vs last month
        </span>
      </CardContent>
    </Card>
  )
}
