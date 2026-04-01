"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ReceiptText } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-sidebar/70 p-4 backdrop-blur lg:block">
      <div className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Finboard</p>
        <p className="mt-1 text-2xl font-semibold">Money in Motion</p>
      </div>
      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
