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
            className="rounded-3xl border border-border/70 bg-background/80 px-3.5 py-3 sm:px-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium sm:whitespace-normal">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
              </div>
              <p className="shrink-0 min-w-20 text-right text-lg font-semibold tabular-nums sm:min-w-28">
                {formatCurrency(tx.amount)}
              </p>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <CategoryBadge category={tx.category} />
              <StatusBadge status={tx.status} />
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
