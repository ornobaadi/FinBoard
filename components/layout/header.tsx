"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MoonStar, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { RoleToggle } from "@/components/layout/role-toggle"
import { cn } from "@/lib/utils"

const pageTitle: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
}

export function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold">{pageTitle[pathname] ?? "Finboard"}</h1>
          <p className="text-xs text-muted-foreground">Frontend Assessment Build</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <SunMedium className="hidden dark:block" />
            <MoonStar className="block dark:hidden" />
          </Button>
          <RoleToggle />
          <Link
            href="/transactions"
            className={cn(buttonVariants({ variant: "default" }), "hidden sm:inline-flex")}
          >
            Manage
          </Link>
        </div>
      </div>
    </header>
  )
}
