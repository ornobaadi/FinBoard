"use client"

import { ShieldCheck, User } from "lucide-react"

import { useAppStore } from "@/store/use-app-store"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function RoleToggle() {
  const role = useAppStore((state) => state.role)
  const setRole = useAppStore((state) => state.setRole)

  return (
    <Select value={role} onValueChange={(value) => setRole(value as "viewer" | "admin")}>
      <SelectTrigger className="w-[140px] bg-background/90">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">
          <div className="inline-flex items-center gap-2">
            <User className="size-4" />
            Viewer
          </div>
        </SelectItem>
        <SelectItem value="admin">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Admin
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
