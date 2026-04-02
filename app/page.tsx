"use client"

import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowRightLeft,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
} from "lucide-react"

import { CategoryChart } from "@/components/dashboard/CategoryChart"
import { FinancePulseCard } from "@/components/dashboard/FinancePulseCard"
import { InsightsPanel } from "@/components/dashboard/InsightsPanel"
import { MonthlyTrendChart } from "@/components/dashboard/MonthlyTrendChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { TopCategoriesCard } from "@/components/dashboard/TopCategoriesCard"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { useFirstLoadStagger } from "@/hooks/use-first-load-stagger"
import { useAppStore, useDashboardStats } from "@/store/useAppStore"

export default function Page() {
  const stats = useDashboardStats()
  const transactions = useAppStore((state) => state.transactions)
  const shouldAnimate = useFirstLoadStagger()

  const pendingCount = useMemo(
    () => transactions.filter((tx) => tx.status === "pending").length,
    [transactions]
  )

  const savingsRate = useMemo(() => {
    if (!stats.totals.income) {
      return 0
    }

    return (stats.totals.net / stats.totals.income) * 100
  }, [stats.totals.income, stats.totals.net])

  const summaryCards = useMemo(
    () => [
      {
        title: "Total Income",
        value: stats.totals.income,
        changePercent: stats.comparison.income,
        icon: BanknoteArrowUp,
      },
      {
        title: "Total Expenses",
        value: stats.totals.expense,
        changePercent: stats.comparison.expense,
        icon: BanknoteArrowDown,
      },
      {
        title: "Net Balance",
        value: stats.totals.net,
        changePercent: stats.comparison.net,
        icon: CircleDollarSign,
      },
      {
        title: "Transactions",
        value: stats.totals.transactions,
        isCurrency: false,
        changePercent: stats.comparison.transactions,
        icon: ArrowRightLeft,
      },
    ],
    [stats]
  )

  return (
    <div className="relative min-h-dvh bg-linear-to-br from-emerald-50/80 via-background to-cyan-50/40 dark:from-emerald-950/30 dark:via-background dark:to-cyan-950/20">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(20,184,166,0.1),transparent_30%),radial-gradient(circle_at_30%_90%,rgba(6,182,212,0.08),transparent_25%)]" />

      <div className="relative flex min-h-dvh">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Header eyebrow="Dashboard" title="Finance Command Center" />

          <main className="space-y-4 px-4 pt-1 pb-20 sm:px-6 lg:space-y-5 lg:px-8 lg:pb-8">
            <section id="overview" className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
              {summaryCards.map((card, index) => (
                <div
                  key={card.title}
                  className={
                    shouldAnimate
                      ? `fx-rise ${index > 0 ? `fx-rise-delay-${Math.min(index, 3)}` : ""}`
                      : ""
                  }
                >
                  <SummaryCard {...card} />
                </div>
              ))}
            </section>

            <section className="grid gap-3.5 xl:grid-cols-[1.3fr_1fr] xl:gap-4">
              <div className="space-y-3.5">
                <InsightsPanel
                  monthLabel={stats.insights.currentMonthLabel}
                  topCategory={stats.insights.topCategory}
                  burnRate={stats.insights.burnRate}
                  budgetHealth={stats.insights.budgetHealth}
                  expenseChangePercent={stats.insights.expenseChangePercent}
                  incomeExpenseRatio={stats.insights.incomeExpenseRatio}
                />
                <MonthlyTrendChart
                  data={stats.insights.monthlyTrend}
                  narrative={stats.insights.narratives.trend}
                  anomaly={stats.insights.anomaly}
                />
                <FinancePulseCard
                  netBalance={stats.totals.net}
                  expenseChangePercent={stats.insights.expenseChangePercent}
                  savingsRate={savingsRate}
                  pendingCount={pendingCount}
                />
              </div>

              <div className="space-y-3.5">
                <CategoryChart
                  data={stats.insights.categoryBreakdown}
                  monthLabel={stats.insights.currentMonthLabel}
                  narrative={stats.insights.narratives.category}
                />
                <TopCategoriesCard
                  monthLabel={stats.insights.currentMonthLabel}
                  data={stats.insights.topCategories}
                />
                <RecentTransactions data={stats.recentTransactions} />
              </div>
            </section>
          </main>

          <nav className="fixed right-4 bottom-4 left-4 z-20 grid grid-cols-2 rounded-4xl border border-border/70 bg-card/90 p-2 shadow-sm backdrop-blur supports-[padding:max(0px)]:pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
            <a href="#overview" className="rounded-3xl bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">
              Dashboard
            </a>
            <Link href="/transactions" className="rounded-3xl px-3 py-2 text-center text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60">
              Transactions
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
