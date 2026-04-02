import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-dvh space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-80" />
      </div>

      <Skeleton className="h-14 rounded-4xl" />
      <Skeleton className="h-60 rounded-4xl" />
      <Skeleton className="h-[520px] rounded-4xl" />
    </div>
  )
}
