"use client"

import { useMemo, useState } from "react"

import { categories } from "@/data/categories"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Transaction } from "@/types"

interface TransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Transaction | null
  onSubmit: (data: Omit<Transaction, "id">) => void
}

const emptyForm: Omit<Transaction, "id"> = {
  description: "",
  amount: 0,
  type: "expense",
  category: "Food & Groceries",
  date: new Date().toISOString().slice(0, 10),
  status: "completed",
}

export function TransactionModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: TransactionModalProps) {
  const baseForm = useMemo<Omit<Transaction, "id">>(() => {
    if (!initialData) {
      return emptyForm
    }

    return {
      description: initialData.description,
      amount: initialData.amount,
      type: initialData.type,
      category: initialData.category,
      date: initialData.date,
      status: initialData.status,
    }
  }, [initialData])

  const [form, setForm] = useState<Omit<Transaction, "id">>(baseForm)
  const [error, setError] = useState("")

  const isEdit = useMemo(() => Boolean(initialData), [initialData])
  const typeLabel = form.type === "income" ? "Income" : "Expense"
  const statusLabel = form.status === "completed" ? "Completed" : "Pending"

  const handleSubmit = () => {
    if (!form.description.trim()) {
      setError("Description is required.")
      return
    }

    if (form.amount <= 0) {
      setError("Amount must be greater than 0.")
      return
    }

    if (!form.date) {
      setError("Date is required.")
      return
    }

    setError("")
    onSubmit({ ...form, description: form.description.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit transaction" : "Add transaction"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update transaction details and save changes."
              : "Create a new transaction entry for your ledger."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Payment description"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={1}
                value={form.amount || ""}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
                }
                placeholder="0"
              />
            </div>

            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, type: value as "income" | "expense" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type">{typeLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    category: value ?? "Food & Groceries",
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value as "completed" | "pending" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status">{statusLabel}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? "Save changes" : "Create transaction"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
