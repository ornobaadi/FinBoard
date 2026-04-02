"use client"

import Link from "next/link"
import { useState } from "react"
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

  return (
    <div className="relative min-h-dvh bg-gradient-to-br from-emerald-50/80 via-background to-cyan-50/40 dark:from-emerald-950/30 dark:via-background dark:to-cyan-950/20">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(20,184,166,0.1),transparent_30%),radial-gradient(circle_at_30%_90%,rgba(6,182,212,0.08),transparent_25%)]" />

      <div className="relative flex min-h-dvh">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Header eyebrow="Transactions" title="Transaction Workspace" searchPlaceholder="Search by description..." />

          <main className="space-y-4 px-4 pt-1 pb-28 sm:px-6 lg:space-y-5 lg:px-8 lg:pb-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">Manage Transactions</CardTitle>
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

              <TransactionFilters />

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
            <Link href="/" className="rounded-3xl px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground">
              Dashboard
            </Link>
            <span className="rounded-3xl bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-foreground">
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
            deleteTransaction(deletingTransaction.id)
          }
          setDeleteDialogOpen(false)
          setDeletingTransaction(null)
        }}
      />
    </div>
  )
}
