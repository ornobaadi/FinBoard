"use client"

import Link from "next/link"
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react"
import { Plus } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { DeleteConfirmDialog } from "@/components/transactions/DeleteConfirmDialog"
import { TransactionFilters } from "@/components/transactions/TransactionFilters"
import { TransactionModal } from "@/components/transactions/TransactionModal"
import { TransactionTable } from "@/components/transactions/TransactionTable"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { useAppStore, useFilteredTransactions } from "@/store/useAppStore"
import { Transaction } from "@/types"

export default function TransactionsPage() {
  const role = useAppStore((state) => state.role)
  const transactions = useAppStore((state) => state.transactions)
  const clearFilters = useAppStore((state) => state.clearFilters)
  const addTransaction = useAppStore((state) => state.addTransaction)
  const updateTransaction = useAppStore((state) => state.updateTransaction)
  const deleteTransaction = useAppStore((state) => state.deleteTransaction)

  const filteredTransactions = useFilteredTransactions()
  const isAdmin = role === "admin"

  const [transactionModalOpen, setTransactionModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [undoTransaction, setUndoTransaction] = useState<Transaction | null>(null)

  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const filterSignature = useMemo(
    () => filteredTransactions.map((tx) => tx.id).join("|"),
    [filteredTransactions]
  )
  const deferredFilterSignature = useDeferredValue(filterSignature)
  const isFiltering = deferredFilterSignature !== filterSignature

  const exportCsv = () => {
    if (!filteredTransactions.length) {
      return
    }

    const header = ["date", "description", "category", "type", "status", "amount"]
    const escapeCell = (value: string | number) => {
      const raw = String(value)
      if (raw.includes(",") || raw.includes('"') || raw.includes("\n")) {
        return `"${raw.replaceAll('"', '""')}"`
      }
      return raw
    }

    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.description,
      tx.category,
      tx.type,
      tx.status,
      tx.amount,
    ])
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escapeCell(cell)).join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "finboard-transactions.csv"
    link.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const target = event.target as HTMLElement | null
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable

      if (!isTypingTarget && event.key.toLowerCase() === "f") {
        event.preventDefault()
        document.getElementById("tx-type-filter")?.focus()
      }

      if (event.key === "/") {
        event.preventDefault()
        document.getElementById("tx-search-input")?.focus()
      }

      if (
        !isTypingTarget &&
        isAdmin &&
        event.key.toLowerCase() === "a" &&
        !transactionModalOpen
      ) {
        event.preventDefault()
        setEditingTransaction(null)
        setTransactionModalOpen(true)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isAdmin, transactionModalOpen])

  return (
    <div className="relative min-h-dvh bg-linear-to-br from-emerald-50/80 via-background to-cyan-50/40 dark:from-emerald-950/30 dark:via-background dark:to-cyan-950/20">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(20,184,166,0.1),transparent_30%),radial-gradient(circle_at_30%_90%,rgba(6,182,212,0.08),transparent_25%)]" />

      <div className="relative flex min-h-dvh">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Header eyebrow="Transactions" title="Transaction Workspace" searchPlaceholder="Search by description..." />

          <main className="space-y-4 px-4 pt-1 pb-28 sm:px-6 lg:space-y-5 lg:px-8 lg:pb-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">Manage Transactions</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Shortcuts: <kbd className="rounded border px-1.5 py-0.5">A</kbd> add,
                    <kbd className="ml-1 rounded border px-1.5 py-0.5">/</kbd> search,
                    <kbd className="ml-1 rounded border px-1.5 py-0.5">F</kbd> first filter
                  </p>
                </div>
                {isAdmin ? (
                  <Button
                    size="sm"
                    className="hidden bg-emerald-600 hover:bg-emerald-700 lg:inline-flex"
                    onClick={() => {
                      setEditingTransaction(null)
                      setTransactionModalOpen(true)
                    }}
                  >
                    <Plus className="size-4" /> Add Transaction
                  </Button>
                ) : null}
              </div>

              <TransactionFilters
                canExport={filteredTransactions.length > 0}
                onExportCsv={exportCsv}
              />

              {!transactions.length ? (
                <EmptyState
                  title="No transactions yet"
                  description="Add your first transaction to start seeing analytics and trends."
                  actionLabel={isAdmin ? "Add Transaction" : undefined}
                  onAction={isAdmin ? () => setTransactionModalOpen(true) : undefined}
                />
              ) : (
                <TransactionTable
                  data={filteredTransactions}
                  isAdmin={isAdmin}
                  isFiltering={isFiltering}
                  removingId={removingId}
                  onEdit={(tx) => {
                    setEditingTransaction(tx)
                    setTransactionModalOpen(true)
                  }}
                  onDelete={(tx) => {
                    setDeletingTransaction(tx)
                    setDeleteDialogOpen(true)
                  }}
                  onClearFilters={clearFilters}
                />
              )}
            </section>
          </main>

          <div className="fixed right-4 bottom-24 z-30 lg:hidden">
            {isAdmin ? (
              <Button
                size="lg"
                className="rounded-full bg-emerald-600 px-6 shadow-lg shadow-emerald-950/25 hover:bg-emerald-700"
                onClick={() => {
                  setEditingTransaction(null)
                  setTransactionModalOpen(true)
                }}
              >
                <Plus className="size-4" /> Add Transaction
              </Button>
            ) : null}
          </div>

          <nav className="fixed right-4 bottom-4 left-4 z-20 grid grid-cols-2 rounded-4xl border border-border/70 bg-card/90 p-2 shadow-sm backdrop-blur supports-[padding:max(0px)]:pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
            <Link href="/" className="rounded-3xl px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">
              Dashboard
            </Link>
            <span className="rounded-3xl bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">
              Transactions
            </span>
          </nav>
        </div>
      </div>

      <TransactionModal
        key={`${editingTransaction?.id ?? "new"}-${transactionModalOpen ? "open" : "closed"}`}
        open={transactionModalOpen}
        onOpenChange={(open) => {
          setTransactionModalOpen(open)
          if (!open) {
            setEditingTransaction(null)
          }
        }}
        initialData={editingTransaction}
        onSubmit={(data) => {
          if (editingTransaction) {
            updateTransaction(editingTransaction.id, data)
            return
          }

          addTransaction(data)
        }}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (deletingTransaction) {
            setRemovingId(deletingTransaction.id)

            setTimeout(() => {
              deleteTransaction(deletingTransaction.id)
              setRemovingId(null)
            }, 180)

            setUndoTransaction(deletingTransaction)

            if (undoTimerRef.current) {
              clearTimeout(undoTimerRef.current)
            }

            undoTimerRef.current = setTimeout(() => {
              setUndoTransaction(null)
            }, 5000)
          }
          setDeleteDialogOpen(false)
          setDeletingTransaction(null)
        }}
      />

      {undoTransaction ? (
        <div
          className="fixed right-4 bottom-20 z-40 flex items-center gap-3 rounded-3xl border border-border/80 bg-card px-4 py-3 shadow-lg lg:right-8 lg:bottom-8"
          aria-live="polite"
        >
          <p className="text-sm text-foreground">Transaction deleted</p>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              addTransaction({
                amount: undoTransaction.amount,
                category: undoTransaction.category,
                date: undoTransaction.date,
                description: undoTransaction.description,
                status: undoTransaction.status,
                type: undoTransaction.type,
              })
              setUndoTransaction(null)

              if (undoTimerRef.current) {
                clearTimeout(undoTimerRef.current)
              }
            }}
          >
            Undo
          </Button>
        </div>
      ) : null}
    </div>
  )
}
