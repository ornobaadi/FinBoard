"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

const categoryColorMap: Record<string, string> = {
  Housing: "#3B82F6",
  "Food & Groceries": "#84CC16",
  Utilities: "#F59E0B",
  Transport: "#06B6D4",
  Shopping: "#EC4899",
  Entertainment: "#8B5CF6",
  Health: "#EF4444",
  Education: "#6366F1",
  Salary: "#10B981",
  Freelance: "#14B8A6",
  Investment: "#22C55E",
}

const fallbackColors = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"]

interface CategoryChartProps {
  data: Array<{ category: string; amount: number }>
}

export function CategoryChart({ data }: CategoryChartProps) {
  const getColor = (category: string, index: number) =>
    categoryColorMap[category] ?? fallbackColors[index % fallbackColors.length]

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
                  <Cell key={`${entry.category}-${index}`} fill={getColor(entry.category, index)} />
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
                  style={{ backgroundColor: getColor(entry.category, index) }}
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
