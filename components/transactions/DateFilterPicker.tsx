"use client"

import { useMemo, useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format, parseISO, startOfDay } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateFilterPickerProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder: string
  minDate?: string | null
  maxDate?: string | null
}

function parseDate(value: string | null) {
  if (!value) {
    return undefined
  }

  const parsed = parseISO(value)
  if (Number.isNaN(parsed.getTime())) {
    return undefined
  }

  return parsed
}

export function DateFilterPicker({
  value,
  onChange,
  placeholder,
  minDate,
  maxDate,
}: DateFilterPickerProps) {
  const [open, setOpen] = useState(false)

  const selectedDate = useMemo(() => parseDate(value), [value])
  const minBoundary = useMemo(() => parseDate(minDate ?? null), [minDate])
  const maxBoundary = useMemo(() => parseDate(maxDate ?? null), [maxDate])

  const disabled = (day: Date) => {
    const current = startOfDay(day)

    if (minBoundary && current < startOfDay(minBoundary)) {
      return true
    }

    if (maxBoundary && current > startOfDay(maxBoundary)) {
      return true
    }

    return false
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" type="button" />}>
        <span
          className={cn(
            "inline-flex h-9 w-full min-w-0 items-center justify-between rounded-3xl px-0 text-left text-sm",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <span>{selectedDate ? format(selectedDate, "MMM dd, yyyy") : placeholder}</span>
          <CalendarIcon className="ml-2 size-4 text-muted-foreground" />
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="end">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : null)
            if (date) {
              setOpen(false)
            }
          }}
          disabled={disabled}
        />
        <div className="mt-1.5 flex items-center justify-between px-2 pb-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => {
              onChange(null)
              setOpen(false)
            }}
          >
            Clear
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => {
              onChange(format(new Date(), "yyyy-MM-dd"))
              setOpen(false)
            }}
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}