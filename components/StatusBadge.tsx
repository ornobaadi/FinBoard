import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: "completed" | "pending" }) {
  const isCompleted = status === "completed"

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        isCompleted
          ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
          : "border-amber-600/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
      )}
    >
      {status}
    </Badge>
  )
}
