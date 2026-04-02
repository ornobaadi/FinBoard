"use client"

import { useMemo, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { CategoryBadge } from "@/components/CategoryBadge"
import { EmptyState } from "@/components/EmptyState"
import { StatusBadge } from "@/components/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Transaction } from "@/types"

interface TransactionTableProps {
  data: Transaction[]
  isAdmin: boolean
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
  onClearFilters: () => void
}

const PAGE_SIZE = 10

export function TransactionTable({
  data,
  isAdmin,
  onEdit,
  onDelete,
  onClearFilters,
}: TransactionTableProps) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE))

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return data.slice(start, start + PAGE_SIZE)
  }, [data, page])

  if (!data.length) {
    return (
      <EmptyState
        title="No results match your filters"
        description="Try clearing filters or changing search criteria."
        actionLabel="Clear Filters"
        onAction={onClearFilters}
      />
    )
  }

  return (
    <Card className="gap-0 bg-card/80 py-0 shadow-sm">
      <CardHeader className="border-b border-border/70 pt-4 pb-3.5">
        <CardTitle className="text-lg">Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3.5 pt-3.5 pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{formatDate(tx.date)}</TableCell>
                <TableCell className="font-medium">{tx.description}</TableCell>
                <TableCell>
                  <CategoryBadge category={tx.category} />
                </TableCell>
                <TableCell>
                  <span
                    className={
                      tx.type === "income"
                        ? "rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                        : "rounded-full bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300"
                    }
                  >
                    {tx.type}
                  </span>
                </TableCell>
                <TableCell className="font-semibold tabular-nums">{formatCurrency(tx.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={tx.status} />
                </TableCell>
                {isAdmin ? (
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(tx)} aria-label="Edit">
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onDelete(tx)}
                        aria-label="Delete"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, data.length)} of {data.length}
          </p>
          <div className="inline-flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="tabular-nums">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
