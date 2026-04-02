"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryChartColor } from "@/lib/category-colors"
import { formatCurrency } from "@/lib/utils"

interface CategoryChartProps {
  data: Array<{ category: string; amount: number }>
  monthLabel: string
  narrative: string
}

function CategoryTooltip({
  active,
  payload,
  monthLabel,
  total,
}: {
  active?: boolean
  payload?: Array<{ payload: { category: string; amount: number } }>
  monthLabel: string
  total: number
}) {
  if (!active || !payload?.length) {
    return null
  }

  const row = payload[0]?.payload as { category: string; amount: number }
  const amount = Number(row?.amount ?? 0)
  const share = total ? (amount / total) * 100 : 0

  return (
    <div className="rounded-2xl border border-border/80 bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="font-semibold text-foreground">{row.category}</p>
      <p className="mt-1 text-muted-foreground">{monthLabel}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">{formatCurrency(amount)}</p>
      <p className="text-muted-foreground tabular-nums">{share.toFixed(1)}% of monthly spend</p>
    </div>
  )
}

export function CategoryChart({ data, monthLabel, narrative }: CategoryChartProps) {
  const total = data.reduce((sum, row) => sum + row.amount, 0)
  const hasData = data.length > 0 && total > 0

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3.5 pt-1 pb-4 md:grid-cols-2">
        <div className="h-56">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={58}
                  outerRadius={86}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell key={`${entry.category}-${index}`} fill={getCategoryChartColor(entry.category, index)} />
                  ))}
                </Pie>
                <Tooltip
                  cursor={false}
                  content={<CategoryTooltip monthLabel={monthLabel} total={total} />}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-border/70 bg-background/40 px-4 text-center text-sm text-muted-foreground">
              No expense data for {monthLabel} yet.
            </div>
          )}
        </div>

        <div className="space-y-2">
          {hasData ? data.map((entry, index) => (
            <div key={entry.category} className="flex items-center justify-between rounded-3xl bg-muted/50 px-3 py-2 text-sm">
              <span className="inline-flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: getCategoryChartColor(entry.category, index) }}
                  aria-hidden
                />
                {entry.category}
              </span>
              <span className="font-semibold tabular-nums">{formatCurrency(entry.amount)}</span>
            </div>
          )) : (
            <div className="rounded-3xl border border-dashed border-border/70 px-3 py-3 text-sm text-muted-foreground">
              Add expense transactions to see category concentration and share.
            </div>
          )}

          <p className="rounded-3xl border border-dashed border-border/70 bg-background/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {narrative}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
