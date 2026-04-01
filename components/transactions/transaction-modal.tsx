"use client"

import { useState } from "react"

import { categories } from "@/data/categories"
import type { Transaction } from "@/types"
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

interface TransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: Transaction | null
  onSubmit: (value: Omit<Transaction, "id">) => void
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
  initialValue,
  onSubmit,
}: TransactionModalProps) {
  const [form, setForm] = useState<Omit<Transaction, "id">>(() =>
    initialValue ? { ...initialValue } : emptyForm
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const nextErrors: Record<string, string> = {}

    if (!form.description.trim()) {
      nextErrors.description = "Description is required"
    }
    if (!form.amount || form.amount <= 0) {
      nextErrors.amount = "Amount must be greater than zero"
    }
    if (!form.category) {
      nextErrors.category = "Category is required"
    }
    if (!form.date) {
      nextErrors.date = "Date is required"
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const save = () => {
    if (!validate()) {
      return
    }

    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialValue ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            Fill all fields. Amount must be a positive number.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
            {errors.description ? <p className="text-xs text-destructive">{errors.description}</p> : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                min={0}
                value={form.amount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, amount: Number(event.target.value) }))
                }
              />
              {errors.amount ? <p className="text-xs text-destructive">{errors.amount}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, type: value as "income" | "expense" }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(value) => {
                  if (!value) {
                    return
                  }
                  setForm((prev) => ({ ...prev, category: value }))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category ? <p className="text-xs text-destructive">{errors.category}</p> : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              />
              {errors.date ? <p className="text-xs text-destructive">{errors.date}</p> : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value as "completed" | "pending" }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>{initialValue ? "Save Changes" : "Add Transaction"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
