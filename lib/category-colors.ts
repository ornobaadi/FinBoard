export const categoryChartColors: Record<string, string> = {
  Housing: "#3B82F6",
  "Food & Groceries": "#84CC16",
  Utilities: "#F59E0B",
  Transport: "#06B6D4",
  Shopping: "#EC4899",
  Entertainment: "#8B5CF6",
  Health: "#EF4444",
  Education: "#6366F1",
  Salary: "#10B981",
  Freelance: "#14B8A6",
  Investment: "#22C55E",
}

export const categoryBadgeColors: Record<string, string> = {
  Housing: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  "Food & Groceries": "bg-lime-500/15 text-lime-700 dark:text-lime-300",
  Utilities: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  Transport: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300",
  Shopping: "bg-pink-500/15 text-pink-700 dark:text-pink-300",
  Entertainment: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  Health: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  Education: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
  Salary: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Freelance: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  Investment: "bg-green-500/15 text-green-700 dark:text-green-300",
}

export const fallbackChartColors = ["#10B981", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4"]

export function getCategoryChartColor(category: string, index: number) {
  return categoryChartColors[category] ?? fallbackChartColors[index % fallbackChartColors.length]
}

export function getCategoryBadgeColor(category: string) {
  return categoryBadgeColors[category] ?? "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300"
}
