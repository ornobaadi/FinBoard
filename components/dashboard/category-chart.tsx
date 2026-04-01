"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { SpendingCategoryPoint } from "@/types"

const colors = ["#0284c7", "#0f766e", "#4d7c0f", "#b45309", "#be123c", "#7c3aed"]

interface CategoryChartProps {
  data: SpendingCategoryPoint[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={88}
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.category} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? formatCurrency(value) : "-"
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-2 text-xs">
          {data.slice(0, 6).map((item, index) => (
            <div key={item.category} className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2">
                <span className="size-2 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                {item.category}
              </span>
              <span className="font-medium">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
