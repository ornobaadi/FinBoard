"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { useMemo } from "react"
import {
  ArrowRightLeft,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CircleDollarSign,
  LayoutDashboard,
  SlidersHorizontal,
} from "lucide-react"

import { InsightsPanel } from "@/components/dashboard/InsightsPanel"
import { SummaryCard } from "@/components/dashboard/SummaryCard"
import { DemoControls } from "@/components/layout/demo-controls"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { useFirstLoadStagger } from "@/hooks/use-first-load-stagger"
import { useAppStore, useDashboardStats } from "@/store/useAppStore"

const CategoryChart = dynamic(
  () => import("@/components/dashboard/CategoryChart").then((mod) => mod.CategoryChart),
  {
    loading: () => <div className="h-72 rounded-4xl border border-border/70 bg-card/70" />,
  }
)

const MonthlyTrendChart = dynamic(
  () => import("@/components/dashboard/MonthlyTrendChart").then((mod) => mod.MonthlyTrendChart),
  {
    loading: () => <div className="h-80 rounded-4xl border border-border/70 bg-card/70" />,
  }
)

const FinancePulseCard = dynamic(
  () => import("@/components/dashboard/FinancePulseCard").then((mod) => mod.FinancePulseCard),
  {
    loading: () => <div className="h-48 rounded-4xl border border-border/70 bg-card/70" />,
  }
)

const RecentTransactions = dynamic(
  () => import("@/components/dashboard/RecentTransactions").then((mod) => mod.RecentTransactions),
  {
    loading: () => <div className="h-72 rounded-4xl border border-border/70 bg-card/70" />,
  }
)

export default function Page() {
  const stats = useDashboardStats()
  const transactions = useAppStore((state) => state.transactions)
  const filters = useAppStore((state) => state.filters)
  const setFilter = useAppStore((state) => state.setFilter)
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

  const recentTransactions = useMemo(() => {
    const query = filters.search.trim().toLowerCase()

    if (!query) {
      return stats.recentTransactions
    }

    return [...transactions]
      .filter((tx) => tx.description.toLowerCase().includes(query))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6)
  }, [filters.search, stats.recentTransactions, transactions])

  return (
    <div className="relative min-h-dvh bg-linear-to-br from-emerald-50/80 via-background to-cyan-50/40 dark:from-emerald-950/30 dark:via-background dark:to-cyan-950/20">
      <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_85%_30%,rgba(20,184,166,0.1),transparent_30%),radial-gradient(circle_at_30%_90%,rgba(6,182,212,0.08),transparent_25%)]" />

      <div className="relative flex min-h-dvh">
        <Sidebar />

        <div className="min-w-0 flex-1">
          <Header
            eyebrow="Dashboard"
            title="Finance Command Center"
            searchPlaceholder="Search transactions..."
            searchValue={filters.search}
            onSearchChange={(value) => setFilter("search", value)}
            controls={<DemoControls compact />}
          />

          <main className="space-y-4 px-4 pt-1 pb-20 sm:px-6 lg:space-y-5 lg:px-8 lg:pb-8">
            <section
              id="overview"
              className="scroll-mt-24 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4"
            >
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
                  budgetHealth={stats.insights.budgetHealth}
                  expenseChangePercent={stats.insights.expenseChangePercent}
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
                <RecentTransactions data={recentTransactions} />
              </div>
            </section>
          </main>

          <nav className="fixed right-3 bottom-3 left-3 z-20 rounded-4xl border border-border/70 bg-card/92 p-1.5 shadow-lg shadow-emerald-950/10 backdrop-blur supports-[padding:max(0px)]:pb-[max(0.4rem,env(safe-area-inset-bottom))] lg:hidden">
            <div className="grid grid-cols-2 gap-1.5">
              <a
                href="#overview"
                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <LayoutDashboard className="size-4" /> Dashboard
              </a>
              <Link
                href="/transactions"
                className="inline-flex items-center justify-center gap-2 rounded-3xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60"
              >
                <SlidersHorizontal className="size-4" /> Transactions
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
