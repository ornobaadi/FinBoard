import Link from "next/link"

import { CategoryBadge } from "@/components/category-badge"
import { EmptyState } from "@/components/empty-state"
import { StatusBadge } from "@/components/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import type { Transaction } from "@/types"

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  if (!transactions.length) {
    return (
      <EmptyState
        title="No transactions yet"
        description="Add your first transaction to start seeing your financial timeline."
        action={
          <Link
            href="/transactions"
            className={cn(buttonVariants({ size: "sm" }), "mt-2 inline-flex")}
          >
            Open Transactions
          </Link>
        }
      />
    )
  }

  return (
    <Card className="border-border/70 bg-card/80 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <Link
          href="/transactions"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex")}
        >
          View All
        </Link>
      </CardHeader>
      <CardContent className="space-y-2">
        {transactions.slice(0, 5).map((tx) => (
          <div key={tx.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-2xl border border-border/60 p-3 text-sm">
            <div>
              <p className="font-medium">{tx.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDate(tx.date)}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <CategoryBadge category={tx.category} />
                <StatusBadge status={tx.status} />
              </div>
            </div>
            <p className={tx.type === "income" ? "font-semibold text-emerald-600 dark:text-emerald-300" : "font-semibold text-rose-600 dark:text-rose-300"}>
              {tx.type === "income" ? "+" : "-"}
              {formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
