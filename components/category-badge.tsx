import { Badge } from "@/components/ui/badge"

interface CategoryBadgeProps {
  category: string
}

const categoryColors: Record<string, string> = {
  Salary: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  Freelance: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  Investment: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Food & Groceries": "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  Transport: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-300",
  Utilities: "bg-purple-500/15 text-purple-700 dark:text-purple-300",
  Health: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  Education: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Entertainment: "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300",
  Shopping: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  Housing: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge variant="secondary" className={categoryColors[category] ?? "bg-muted text-muted-foreground"}>
      {category}
    </Badge>
  )
}
