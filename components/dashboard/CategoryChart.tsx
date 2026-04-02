"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategoryChartColor } from "@/lib/category-colors"
import { formatCurrency } from "@/lib/utils"

interface CategoryChartProps {
  data: Array<{ category: string; amount: number }>
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3.5 pt-1 pb-4 md:grid-cols-2">
        <div className="h-56">
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
              <Tooltip formatter={(value) => formatCurrency(Number(value ?? 0))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {data.map((entry, index) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
