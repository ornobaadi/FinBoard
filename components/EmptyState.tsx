import { WalletCards } from "lucide-react"

import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-4xl border border-dashed border-border/80 bg-card/60 px-6 py-8 text-center">
      <div className="mb-4 rounded-3xl bg-muted p-3">
        <WalletCards className="size-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button onClick={onAction} variant="secondary" className="mt-4">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
