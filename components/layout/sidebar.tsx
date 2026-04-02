"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, TableProperties } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: TableProperties },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 border-r border-border/70 bg-sidebar px-4 py-5 lg:flex lg:flex-col">
      <div className="rounded-4xl bg-linear-to-br from-emerald-500/90 via-teal-500/80 to-cyan-500/80 p-[1px] shadow-lg shadow-emerald-900/15">
        <div className="rounded-[calc(var(--radius-4xl)-1px)] bg-card/95 p-4 backdrop-blur-sm">
          <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">Finboard</p>
          <h1 className="mt-2 font-heading text-2xl font-semibold">Personal Finance</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track income, control spending, and manage your cashflow with role-based controls.
          </p>
        </div>
      </div>

      <nav className="mt-7 grid gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-3xl px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                isActive
                  ? "bg-emerald-500/15 text-foreground"
                  : "text-muted-foreground hover:bg-emerald-500/10 hover:text-foreground"
              )}
            >
              <Icon className="size-4 text-emerald-700/70 transition group-hover:text-emerald-700 dark:text-emerald-300/70 dark:group-hover:text-emerald-300" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-4xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 p-4">
        <p className="text-xs tracking-[0.14em] text-emerald-900/70 uppercase dark:text-emerald-200/80">
          Smart tip
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Keep your monthly expenses below 70% of income to protect investment capacity.
        </p>
      </div>
    </aside>
  )
}
