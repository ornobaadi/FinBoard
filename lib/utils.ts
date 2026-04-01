import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`)
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function toMonthKey(dateValue: string) {
  const date = new Date(`${dateValue}T00:00:00`)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

export function formatPercent(value: number) {
  if (!Number.isFinite(value)) {
    return "0%"
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
}

export function safePercentChange(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }

  return ((current - previous) / previous) * 100
}
