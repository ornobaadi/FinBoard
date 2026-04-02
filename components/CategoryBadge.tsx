import { Badge } from "@/components/ui/badge"
import { getCategoryBadgeColor } from "@/lib/category-colors"
import { cn } from "@/lib/utils"

export function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="secondary"
      className={cn("border border-transparent", getCategoryBadgeColor(category))}
    >
      {category}
    </Badge>
  )
}
