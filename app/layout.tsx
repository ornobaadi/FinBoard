import type { Metadata, Viewport } from "next"
import { Geist_Mono, Manrope } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://finboard-tracker.vercel.app"),
  title: {
    default: "Finboard | Personal Finance Dashboard",
    template: "%s | Finboard",
  },
  description:
    "Role-based personal finance dashboard for tracking income, expenses, trends, and transactions with actionable insights.",
  applicationName: "Finboard",
  keywords: [
    "finance dashboard",
    "personal finance",
    "expense tracker",
    "income tracker",
    "transaction management",
    "budget insights",
    "nextjs dashboard",
  ],
  authors: [{ name: "Finboard" }],
  creator: "Finboard",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Finboard",
    title: "Finboard | Personal Finance Dashboard",
    description:
      "Track transactions, monitor cashflow, and visualize spending with a modern finance dashboard.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finboard | Personal Finance Dashboard",
    description:
      "Track transactions, monitor cashflow, and visualize spending with a modern finance dashboard.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2faf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1f1d" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        manrope.variable,
        "font-sans"
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
