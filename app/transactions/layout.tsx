import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions",
  description:
    "Browse, filter, and manage your personal finance transactions with role-based controls.",
  alternates: {
    canonical: "/transactions",
  },
}

export default function TransactionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
