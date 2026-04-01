"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ReceiptText } from "lucide-react"

import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ReceiptText },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed right-3 bottom-3 left-3 z-40 rounded-3xl border border-border/70 bg-background/90 p-2 shadow-lg backdrop-blur lg:hidden">
      <ul className="grid grid-cols-2 gap-2">
        {links.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-2xl py-2 text-sm font-medium",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
