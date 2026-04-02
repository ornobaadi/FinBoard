/* global describe, it, expect */

import { getMonthlyTotals, getSummaryInsights } from "@/lib/insights"
import { transactions } from "@/data/transactions"

describe("insights utilities", () => {
  it("calculates monthly totals for a known month", () => {
    const totals = getMonthlyTotals(transactions, "2026-04")

    expect(totals.income).toBeGreaterThan(0)
    expect(totals.expense).toBeGreaterThan(0)
    expect(totals.count).toBeGreaterThan(0)
  })

  it("returns storytelling insights with top categories and narratives", () => {
    const insights = getSummaryInsights(transactions)

    expect(insights.topCategory.name.length).toBeGreaterThan(0)
    expect(insights.topCategories.length).toBeLessThanOrEqual(3)
    expect(insights.budgetHealth.label.length).toBeGreaterThan(0)
    expect(insights.narratives.trend.length).toBeGreaterThan(0)
    expect(insights.narratives.category.length).toBeGreaterThan(0)
  })

  it("flags anomaly for unusually large expense", () => {
    const withOutlier = [
      ...transactions,
      {
        id: "txn_outlier",
        description: "Laptop bundle",
        amount: 120000,
        type: "expense" as const,
        category: "Shopping",
        date: "2026-04-11",
        status: "completed" as const,
      },
    ]

    const insights = getSummaryInsights(withOutlier)

    expect(insights.anomaly).not.toBeNull()
    expect(insights.anomaly?.description).toBe("Laptop bundle")
  })
})
