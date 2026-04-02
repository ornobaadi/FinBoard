"use client"

import { RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/store/useAppStore"
import { DemoScenarioKey } from "@/types"

const scenarioOptions: Array<{ key: DemoScenarioKey; label: string }> = [
  { key: "balanced", label: "Balanced" },
  { key: "overspending", label: "Overspending" },
  { key: "highSavings", label: "High Savings" },
]

interface DemoControlsProps {
  compact?: boolean
}

export function DemoControls({ compact = false }: DemoControlsProps) {
  const scenario = useAppStore((state) => state.scenario)
  const loadScenario = useAppStore((state) => state.loadScenario)
  const resetDemoData = useAppStore((state) => state.resetDemoData)
  const selectedScenarioLabel =
    scenarioOptions.find((option) => option.key === scenario)?.label ?? "Scenario"

  if (compact) {
    return (
      <Select
        value={scenario}
        onValueChange={(value) => loadScenario(value as DemoScenarioKey)}
      >
        <SelectTrigger className="w-[156px] bg-card" aria-label="Select demo scenario">
          <SelectValue placeholder="Scenario">{selectedScenarioLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {scenarioOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border/70 bg-card/70 p-2.5">
      <Select
        value={scenario}
        onValueChange={(value) => loadScenario(value as DemoScenarioKey)}
      >
        <SelectTrigger className="h-8 min-w-[150px] bg-background" aria-label="Select demo scenario">
          <SelectValue placeholder="Scenario">{selectedScenarioLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {scenarioOptions.map((option) => (
            <SelectItem key={option.key} value={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" variant="outline" onClick={resetDemoData}>
        <RotateCcw className="size-3.5" /> Reset Data
      </Button>
    </div>
  )
}
