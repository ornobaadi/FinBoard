"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col gap-3",
        month: "space-y-3",
        caption: "relative flex h-8 items-center justify-center",
        caption_label: "block w-full whitespace-nowrap text-center text-sm font-semibold text-foreground tabular-nums",
        nav: "contents",
        button_previous:
          "absolute left-1 inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        button_next:
          "absolute right-1 inline-flex size-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 text-center text-xs font-medium text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative size-9 p-0 text-center text-sm",
        day_button:
          "size-9 rounded-full font-medium transition hover:bg-emerald-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        selected:
          "rounded-full bg-emerald-500/25 text-foreground ring-1 ring-emerald-500/50 hover:bg-emerald-500/30",
        today: "rounded-full text-emerald-300 ring-1 ring-emerald-500/40",
        outside: "text-muted-foreground/45",
        disabled: "text-muted-foreground/35 opacity-50",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", iconClassName)} />
          ) : (
            <ChevronRight className={cn("size-4", iconClassName)} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }