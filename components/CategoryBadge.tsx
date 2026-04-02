import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const categoryColorMap: Record<string, string> = {
  Salary: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Freelance: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  Investment: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  "Food & Groceries": "bg-lime-500/15 text-lime-700 dark:text-lime-300",
  Transport: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  Utilities: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Health: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  Education: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Entertainment: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  Shopping: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  Housing: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300",
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border border-transparent", categoryColorMap[category])}
    >
      {category}
    </Badge>
  )
}
