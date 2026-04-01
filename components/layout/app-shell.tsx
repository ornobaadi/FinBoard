"use client"

import type { ReactNode } from "react"

import { Header } from "@/components/layout/header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { Sidebar } from "@/components/layout/sidebar"

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_10%_10%,rgba(12,74,110,0.09),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(22,101,52,0.10),transparent_35%),linear-gradient(180deg,rgba(244,250,255,0.85),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_10%_10%,rgba(103,232,249,0.08),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(74,222,128,0.08),transparent_35%),linear-gradient(180deg,rgba(2,6,23,1),rgba(3,7,18,1))]">
      <div className="mx-auto flex min-h-dvh max-w-[1400px]">
        <Sidebar />
        <div className="flex min-h-dvh flex-1 flex-col pb-24 lg:pb-0">
          <Header />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
