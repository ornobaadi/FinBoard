"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import type { MonthlySeriesPoint } from "@/types"

interface MonthlyTrendChartProps {
  data: MonthlySeriesPoint[]
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.25} />
              <XAxis dataKey="month" />
              <YAxis width={80} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number" ? formatCurrency(value) : "-"
                }
              />
              <Bar dataKey="income" fill="#0f766e" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expense" fill="#be123c" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
