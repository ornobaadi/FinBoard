import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-dvh space-y-4 px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-72" />
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-38 rounded-4xl" />
        ))}
      </div>

      <div className="grid gap-3.5 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-3.5">
          <Skeleton className="h-44 rounded-4xl" />
          <Skeleton className="h-80 rounded-4xl" />
          <Skeleton className="h-56 rounded-4xl" />
        </div>
        <div className="space-y-3.5">
          <Skeleton className="h-72 rounded-4xl" />
          <Skeleton className="h-56 rounded-4xl" />
          <Skeleton className="h-72 rounded-4xl" />
        </div>
      </div>
    </div>
  )
}
