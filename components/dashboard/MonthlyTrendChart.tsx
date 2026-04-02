"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AlertTriangle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { MonthlyStat } from "@/types"

function TrendTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean
  label?: string
  payload?: Array<{ name?: string; value?: number | string }>
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-2xl border border-border/80 bg-card/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((item) => (
        <p key={item.name} className="mt-1 text-muted-foreground">
          <span className="font-medium text-foreground">{item.name}:</span>{" "}
          <span className="tabular-nums">{formatCurrency(Number(item.value ?? 0))}</span>
        </p>
      ))}
    </div>
  )
}

interface MonthlyTrendChartProps {
  data: MonthlyStat[]
  narrative: string
  anomaly: {
    description: string
    category: string
    amount: number
    monthLabel: string
  } | null
}

export function MonthlyTrendChart({ data, narrative, anomaly }: MonthlyTrendChartProps) {
  const anomalyY = anomaly
    ? data.find((row) => row.month === anomaly.monthLabel)?.expense ?? null
    : null

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg">Monthly Trend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-1 pb-4">
        <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.24} vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <Tooltip content={<TrendTooltip />} />
            <Legend />
            <Bar dataKey="income" name="Income" fill="#1D9B6B" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="#A8B3AE" radius={[8, 8, 0, 0]} />
            {anomaly && anomalyY ? (
              <ReferenceDot
                x={anomaly.monthLabel}
                y={anomalyY}
                r={5}
                fill="#e11d48"
                stroke="#881337"
                strokeWidth={2}
              />
            ) : null}
          </BarChart>
        </ResponsiveContainer>
        </div>

        <p className="rounded-3xl border border-dashed border-border/70 bg-background/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {narrative}
        </p>

        {anomaly ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/60 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="size-3.5" />
            Anomaly marker: {anomaly.description} ({anomaly.category}) reached {formatCurrency(anomaly.amount)} in {anomaly.monthLabel}.
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
