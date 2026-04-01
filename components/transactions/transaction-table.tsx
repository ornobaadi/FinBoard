"use client"

import { useMemo, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { CategoryBadge } from "@/components/category-badge"
import { EmptyState } from "@/components/empty-state"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/components/transactions/delete-confirm-dialog"
import { TransactionModal } from "@/components/transactions/transaction-modal"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useAppStore } from "@/store/use-app-store"
import type { Transaction } from "@/types"

interface TransactionTableProps {
  rows: Transaction[]
}

const PAGE_SIZE = 10

export function TransactionTable({ rows }: TransactionTableProps) {
  const role = useAppStore((state) => state.role)
  const updateTransaction = useAppStore((state) => state.updateTransaction)
  const deleteTransaction = useAppStore((state) => state.deleteTransaction)

  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [deleting, setDeleting] = useState<Transaction | null>(null)

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paginatedRows = useMemo(
    () => rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [page, rows]
  )

  if (!rows.length) {
    return (
      <EmptyState
        title="No results match your filters"
        description="Try changing your search, category, type, or date filters."
      />
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-card/80 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              {role === "admin" ? <TableHead className="text-right">Actions</TableHead> : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.map((tx) => (
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
                        ? "rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300"
                        : "rounded-full bg-rose-500/15 px-2 py-1 text-xs font-medium text-rose-700 dark:text-rose-300"
                    }
                  >
                    {tx.type}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <span className={tx.type === "income" ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={tx.status} />
                </TableCell>
                {role === "admin" ? (
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <Button variant="outline" size="icon-sm" onClick={() => setEditing(tx)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => setDeleting(tx)}
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
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {page} of {pageCount}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pageCount}
            onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <TransactionModal
        key={editing?.id ?? "edit-none"}
        open={Boolean(editing)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setEditing(null)
          }
        }}
        initialValue={editing}
        onSubmit={(value) => {
          if (editing) {
            updateTransaction(editing.id, value)
          }
        }}
      />

      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setDeleting(null)
          }
        }}
        description={
          deleting
            ? `This will permanently remove \"${deleting.description}\" from your transaction list.`
            : ""
        }
        onConfirm={() => {
          if (deleting) {
            deleteTransaction(deleting.id)
          }
          setDeleting(null)
        }}
      />
    </>
  )
}
