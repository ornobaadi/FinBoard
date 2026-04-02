import Link from "next/link"

import { CategoryBadge } from "@/components/CategoryBadge"
import { StatusBadge } from "@/components/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Transaction } from "@/types"

interface RecentTransactionsProps {
  data: Transaction[]
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="border-b border-border/60 pt-4 pb-3.5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Link href="/transactions" className="text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-3.5 pb-4">
        {data.length ? data.map((tx) => (
          <div
            key={tx.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/70 bg-background/80 px-4 py-3"
          >
            <div>
              <p className="font-medium">{tx.description}</p>
              <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={tx.category} />
              <StatusBadge status={tx.status} />
              <p className="min-w-28 text-right font-semibold tabular-nums">{formatCurrency(tx.amount)}</p>
            </div>
          </div>
        )) : (
          <div className="rounded-3xl border border-dashed border-border/70 bg-background/50 px-4 py-5 text-sm text-muted-foreground">
            No transactions match your current search.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
