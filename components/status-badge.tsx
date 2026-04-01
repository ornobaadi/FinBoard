import { Badge } from "@/components/ui/badge"
import type { TransactionStatus } from "@/types"

interface StatusBadgeProps {
  status: TransactionStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "completed") {
    return (
      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
        Completed
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-amber-500/15 text-amber-700 dark:text-amber-300">
      Pending
    </Badge>
  )
}
