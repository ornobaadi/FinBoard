"use client"

import { useMemo, useState } from "react"
import { ArrowUpDown, Download, Plus } from "lucide-react"

import { useAppStore } from "@/store/use-app-store"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionModal } from "@/components/transactions/transaction-modal"
import { TransactionTable } from "@/components/transactions/transaction-table"
import type { Transaction } from "@/types"

type SortKey = "date_desc" | "date_asc" | "amount_desc" | "amount_asc"

function applyFilters(
  rows: ReturnType<typeof useAppStore.getState>["transactions"],
  filters: ReturnType<typeof useAppStore.getState>["filters"]
) {
  return rows
    .filter((tx) =>
      tx.description.toLowerCase().includes(filters.search.toLowerCase().trim())
    )
    .filter((tx) => (filters.type === "all" ? true : tx.type === filters.type))
    .filter((tx) => (filters.status === "all" ? true : tx.status === filters.status))
    .filter((tx) =>
      filters.category.length ? filters.category.includes(tx.category) : true
    )
    .filter((tx) => {
      if (!filters.dateRange.from && !filters.dateRange.to) {
        return true
      }

      if (filters.dateRange.from && tx.date < filters.dateRange.from) {
        return false
      }

      if (filters.dateRange.to && tx.date > filters.dateRange.to) {
        return false
      }

      return true
    })
}

function applySort(rows: Transaction[], sortKey: SortKey) {
  const sorted = [...rows]

  switch (sortKey) {
    case "date_asc":
      return sorted.sort((a, b) => a.date.localeCompare(b.date))
    case "amount_desc":
      return sorted.sort((a, b) => b.amount - a.amount)
    case "amount_asc":
      return sorted.sort((a, b) => a.amount - b.amount)
    case "date_desc":
    default:
      return sorted.sort((a, b) => b.date.localeCompare(a.date))
  }
}

function downloadFile(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function exportCsv(rows: Transaction[]) {
  const header = ["id", "date", "description", "category", "type", "amount", "status"]
  const escaped = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
  const dataRows = rows.map((row) =>
    [
      escaped(row.id),
      escaped(row.date),
      escaped(row.description),
      escaped(row.category),
      escaped(row.type),
      escaped(row.amount),
      escaped(row.status),
    ].join(",")
  )

  const content = [header.join(","), ...dataRows].join("\n")
  downloadFile("transactions-export.csv", content, "text/csv;charset=utf-8")
}

function exportJson(rows: Transaction[]) {
  downloadFile(
    "transactions-export.json",
    JSON.stringify(rows, null, 2),
    "application/json;charset=utf-8"
  )
}

export function TransactionsView() {
  const transactions = useAppStore((state) => state.transactions)
  const filters = useAppStore((state) => state.filters)
  const role = useAppStore((state) => state.role)
  const addTransaction = useAppStore((state) => state.addTransaction)

  const [openAddModal, setOpenAddModal] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>("date_desc")

  const filtered = useMemo(() => {
    const filteredRows = applyFilters(transactions, filters)
    return applySort(filteredRows, sortKey)
  }, [transactions, filters, sortKey])

  const exportDisabled = filtered.length === 0

  const onExportCsv = () => {
    if (!exportDisabled) {
      exportCsv(filtered)
    }
  }

  const onExportJson = () => {
    if (!exportDisabled) {
      exportJson(filtered)
    }
  }

  const exportDateStamp = new Date().toISOString().slice(0, 10)

  const exportTitle = `Filtered export (${filtered.length}) - ${exportDateStamp}`

  const sortLabel: Record<SortKey, string> = {
    date_desc: "Date (Newest)",
    date_asc: "Date (Oldest)",
    amount_desc: "Amount (High to Low)",
    amount_asc: "Amount (Low to High)",
  }

  const sortOptions: SortKey[] = ["date_desc", "date_asc", "amount_desc", "amount_asc"]

  const exportBlock = (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" onClick={onExportCsv} disabled={exportDisabled}>
        <Download className="size-4" />
        Export CSV
      </Button>
      <Button variant="outline" onClick={onExportJson} disabled={exportDisabled}>
        <Download className="size-4" />
        Export JSON
      </Button>
    </div>
  )

  return (
    <div className="space-y-4 fx-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Transaction History</h2>
          <p className="text-sm text-muted-foreground">
            Browse, filter, and manage your financial activity.
          </p>
          <p className="text-xs text-muted-foreground/80">{exportTitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[220px]">
            <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
              <SelectTrigger className="w-full">
                <div className="inline-flex items-center gap-2">
                  <ArrowUpDown className="size-4" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {sortLabel[option]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {exportBlock}

          {role === "admin" ? (
            <Button onClick={() => setOpenAddModal(true)}>
              <Plus className="size-4" />
              Add Transaction
            </Button>
          ) : null}
        </div>
      </div>

      <TransactionFilters />
      <TransactionTable rows={filtered} />

      <TransactionModal
        key={`add-${openAddModal}`}
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        onSubmit={(value) => addTransaction(value)}
      />
    </div>
  )
}
