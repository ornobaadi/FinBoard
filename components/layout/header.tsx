"use client"

import { ReactNode, useEffect, useRef, useState } from "react"
import { Bell, Search, Sparkles, X } from "lucide-react"

import { RoleToggle } from "@/components/layout/RoleToggle"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  eyebrow?: string
  title?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  controls?: ReactNode
}

export function Header({
  eyebrow = "Finance Workspace",
  title = "Finance Command Center",
  searchPlaceholder = "Search transactions...",
  searchValue,
  onSearchChange,
  controls,
}: HeaderProps) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const mobileSearchRef = useRef<HTMLInputElement | null>(null)
  const hasSearch = typeof onSearchChange === "function"

  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchRef.current?.focus()
    }
  }, [mobileSearchOpen])

  return (
    <header className="sticky top-0 z-20 mb-4 border-b border-border/70 bg-background/75 px-4 py-3 backdrop-blur-xl sm:px-6 lg:mb-5 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{eyebrow}</p>
          <h2 className="font-heading text-2xl font-semibold">{title}</h2>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-2.5">
          {controls ? <div className="min-w-0 flex-1 sm:flex-none">{controls}</div> : null}

          {hasSearch ? (
            <Button
              variant="outline"
              size="icon-sm"
              className="shrink-0 md:hidden"
              aria-label={mobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={mobileSearchOpen}
              onClick={() => setMobileSearchOpen((prev) => !prev)}
            >
              {mobileSearchOpen ? <X className="size-4" /> : <Search className="size-4" />}
            </Button>
          ) : null}

          {hasSearch ? (
            <div className="relative hidden md:block">
              <Input
                placeholder={searchPlaceholder}
                className="w-72 bg-card/90 pr-8"
                value={searchValue ?? ""}
                onChange={(event) => onSearchChange(event.target.value)}
              />
              <Sparkles className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          ) : null}

          <div className="shrink-0">
            <ThemeToggle />
          </div>
          <Button variant="outline" size="icon-sm" className="shrink-0" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
          <div className="w-33 sm:w-auto">
            <RoleToggle />
          </div>
        </div>
      </div>

      {hasSearch ? (
        <div className={`md:hidden ${mobileSearchOpen ? "mt-3" : "mt-0 hidden"}`}>
          <div className="relative">
            <Input
              ref={mobileSearchRef}
              placeholder={searchPlaceholder}
              className="w-full bg-card/90 pr-8"
              value={searchValue ?? ""}
              onChange={(event) => onSearchChange(event.target.value)}
            />
            <Sparkles className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      ) : null}
    </header>
  )
}
